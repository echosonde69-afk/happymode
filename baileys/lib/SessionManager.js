import { EventEmitter } from 'events';
import { DisconnectReason } from './Types/index.js';

export class SessionManager {
    constructor(options = {}) {
        this.maxSessions = options.maxSessions || 200;
        this.memoryLimitMb = options.memoryLimitMb || 150;
        this.sessions = new Map();
        this._ev = new EventEmitter();
        this._shuttingDown = false;
        process.on('uncaughtException', (err) => {
            this._ev.emit('manager:uncaughtException', { error: err });
            for (const [id, session] of this.sessions) {
                if (session.end) {
                    try { session.end(new Error('uncaughtException')); } catch {}
                }
            }
        });
    }

    async createSession(sessionId, makeSocketFn, config) {
        if (this.sessions.size >= this.maxSessions) {
            throw new Error(`Session limit reached (${this.maxSessions})`);
        }
        if (this.sessions.has(sessionId)) {
            throw new Error(`Session "${sessionId}" already exists`);
        }

        const session = {
            id: sessionId,
            sock: null,
            config,
            createdAt: Date.now(),
            msgCount: 0,
            reconnectCount: 0,
            listenerCount: 0,
            memoryCheckInterval: null,
            evCleanup: [],
            ended: false,
            end: null,
            saveCreds: null
        };

        const startHeap = process.memoryUsage().heapUsed;

        session.memoryCheckInterval = setInterval(() => {
            if (session.ended || this._shuttingDown) return;
            const currentHeap = process.memoryUsage().heapUsed;
            const deltaMb = (currentHeap - startHeap) / 1024 / 1024;
            if (deltaMb > this.memoryLimitMb) {
                this._ev.emit('session:memory-limit', { sessionId, deltaMb, limit: this.memoryLimitMb });
                this.restartSession(sessionId, makeSocketFn, config).catch(err => {
                    this._ev.emit('session:error', { sessionId, error: err });
                });
            }
        }, 30000);

        const connect = async () => {
            try {
                const sock = makeSocketFn(config);
                session.sock = sock;
                session.saveCreds = config.auth?.saveCreds || (() => {});

                const trackedOn = (event, handler) => {
                    sock.ev.on(event, handler);
                    session.evCleanup.push([event, handler]);
                    session.listenerCount++;
                };

                trackedOn('connection.update', ({ connection, lastDisconnect }) => {
                    if (connection === 'open') {
                        session.reconnectCount = 0;
                        this._ev.emit('session:open', { sessionId });
                    }
                    if (connection === 'close') {
                        const code = lastDisconnect?.error?.output?.statusCode;
                        const shouldReconnect = code !== DisconnectReason.loggedOut
                            && code !== DisconnectReason.multideviceMismatch;
                        if (shouldReconnect && !session.ended && !this._shuttingDown) {
                            session.reconnectCount++;
                            const delay = Math.min(1000 * Math.pow(2, Math.min(session.reconnectCount, 5)), 30000);
                            setTimeout(() => {
                                if (!session.ended && !this._shuttingDown) connect().catch(() => {});
                            }, delay);
                        }
                    }
                });

                trackedOn('messages.upsert', ({ messages }) => {
                    session.msgCount += messages.length;
                });

                session.end = async (error) => {
                    session.ended = true;
                    if (session.memoryCheckInterval) {
                        clearInterval(session.memoryCheckInterval);
                        session.memoryCheckInterval = null;
                    }
                    for (const [event, handler] of session.evCleanup) {
                        try { sock.ev.off(event, handler); } catch {}
                    }
                    session.evCleanup.length = 0;
                    session.listenerCount = 0;
                    try {
                        if (session.saveCreds) await session.saveCreds();
                    } catch {}
                    try { sock.end(error); } catch {}
                    session.sock = null;
                };
            } catch (err) {
                this._ev.emit('session:error', { sessionId, error: err });
                if (!session.ended && !this._shuttingDown) {
                    setTimeout(() => {
                        if (!session.ended && !this._shuttingDown) connect().catch(() => {});
                    }, 5000);
                }
            }
        };

        await connect();
        this.sessions.set(sessionId, session);
        this._ev.emit('session:created', { sessionId });
        return session;
    }

    async endSession(sessionId, error) {
        const session = this.sessions.get(sessionId);
        if (!session) return;
        if (session.end) {
            await session.end(error || new Error('Session ended'));
        }
        this.sessions.delete(sessionId);
        this._ev.emit('session:ended', { sessionId });
    }

    async restartSession(sessionId, makeSocketFn, config) {
        await this.endSession(sessionId);
        return this.createSession(sessionId, makeSocketFn, config);
    }

    async endAll() {
        this._shuttingDown = true;
        const ids = Array.from(this.sessions.keys());
        await Promise.allSettled(ids.map(id => this.endSession(id)));
    }

    getSessionStats(sessionId) {
        const s = this.sessions.get(sessionId);
        if (!s) return null;
        return {
            uptime: Date.now() - s.createdAt,
            messageCount: s.msgCount,
            reconnectCount: s.reconnectCount,
            listenerCount: s.listenerCount,
            currentHeapDeltaMb: s.sock
                ? (process.memoryUsage().heapUsed - s.createdAt) / 1024 / 1024
                : 0,
            state: s.ended
                ? 'ended'
                : s.sock?.ws?.isOpen
                    ? 'open'
                    : 'connecting',
            hasSocket: !!s.sock
        };
    }

    getAllSessionStats() {
        const stats = {};
        for (const [id] of this.sessions) {
            stats[id] = this.getSessionStats(id);
        }
        return stats;
    }

    on(event, handler) { this._ev.on(event, handler); }
    off(event, handler) { this._ev.off(event, handler); }
}
