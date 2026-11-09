import zlib from 'zlib';
import { Boom } from '@hapi/boom';
import { getBinaryNodeChild, S_WHATSAPP_NET } from '../WABinary/index.js';
const wMexQuery = (variables, queryId, query, generateMessageTag) => {
    return query({
        tag: 'iq',
        attrs: {
            id: generateMessageTag(),
            type: 'get',
            to: S_WHATSAPP_NET,
            xmlns: 'w:mex'
        },
        content: [
            {
                tag: 'query',
                attrs: { query_id: queryId },
                content: Buffer.from(JSON.stringify({ variables }), 'utf-8')
            }
        ]
    });
};
/**
 * Turn whatever WhatsApp put inside <result> into a Buffer.
 * Handles Buffer / Uint8Array / string and (rarely) nested binary nodes.
 */
const contentToBuffer = (raw, depth = 0) => {
    if (raw == null || depth > 4) return null;
    if (Buffer.isBuffer(raw)) return raw;
    if (raw instanceof Uint8Array) return Buffer.from(raw);
    if (typeof raw === 'string') return Buffer.from(raw, 'utf8');
    if (Array.isArray(raw)) {
        for (const n of raw) {
            const b = contentToBuffer(n?.content ?? n, depth + 1);
            if (b && b.length) return b;
        }
    }
    return null;
};
/**
 * Tolerant JSON extraction: plain JSON, JSON with junk/control bytes in front,
 * or gzip / deflate / brotli compressed JSON. Returns undefined if nothing parses.
 */
const extractJson = (buf) => {
    const candidates = [buf];
    for (const fn of [zlib.gunzipSync, zlib.inflateSync, zlib.inflateRawSync, zlib.brotliDecompressSync]) {
        try {
            const out = fn(buf);
            if (out && out.length) candidates.push(out);
        } catch { /* not this encoding */ }
    }
    for (const b of candidates) {
        const text = b.toString('utf8');
        try { return JSON.parse(text.trim()); } catch { /* keep trying */ }
        const start = text.search(/[\[{]/);
        const end = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'));
        if (start >= 0 && end > start) {
            try { return JSON.parse(text.slice(start, end + 1)); } catch { /* keep trying */ }
        }
    }
    return undefined;
};
export const executeWMexQuery = async (variables, queryId, dataPath, query, generateMessageTag) => {
    const result = await wMexQuery(variables, queryId, query, generateMessageTag);
    const child = getBinaryNodeChild(result, 'result');
    if (child?.content) {
        const buf = contentToBuffer(child.content);
        const data = buf ? extractJson(buf) : undefined;
        if (data === undefined) {
            // Keep the raw bytes on the error so callers can inspect / recover from them.
            const hex = buf ? buf.subarray(0, 24).toString('hex') : '';
            const asText = buf ? buf.subarray(0, 60).toString('utf8').replace(/[^\x20-\x7e]/g, '.') : '';
            if (process.env.MEX_DEBUG) {
                console.warn(`[mex] unreadable reply for query ${queryId}: ${buf ? buf.length : 0} bytes, hex=${hex}, text=${asText}`);
            }
            throw new Boom(
                `Failed to parse mex result (non-JSON / binary response). query=${queryId} bytes=${buf ? buf.length : 0} hex=${hex} text="${asText}"`,
                { statusCode: 400, data: { queryId, rawBase64: buf ? buf.subarray(0, 4096).toString('base64') : '' } }
            );
        }
        if (data.errors && data.errors.length > 0) {
            const errorMessages = data.errors.map((err) => err.message || 'Unknown error').join(', ');
            const firstError = data.errors[0];
            const errorCode = firstError.extensions?.error_code || 400;
            throw new Boom(`GraphQL server error: ${errorMessages}`, { statusCode: errorCode, data: firstError });
        }
        const response = dataPath ? data?.data?.[dataPath] : data?.data;
        if (typeof response !== 'undefined') {
            return response;
        }
    }
    const action = (dataPath || '').startsWith('xwa2_')
        ? dataPath.substring(5).replace(/_/g, ' ')
        : dataPath?.replace(/_/g, ' ');
    throw new Boom(`Failed to ${action}, unexpected response structure.`, { statusCode: 400, data: result });
};
//# sourceMappingURL=mex.js.map
