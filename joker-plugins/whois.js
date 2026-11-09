// Joker plugin: whois  — commands: whois, who
// (extracted from routes/pairing.js line 8124; behaviour unchanged)
import { countryFromNumber, getContext, isGroup, jidNumber } from "../core/helpers.js";

export default {
  name: "whois",
  aliases: ["whois","who"],
  order: 8124,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["whois", "who"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    try {
      const sock_ = sock;
      let meta = null;
      if (isGroup(jid)) { try { meta = await sock_.groupMetadata(jid); } catch {} }
      const ctx = getContext(msg);
      const selfJid = msg.key.fromMe ? (sock_.user?.id || "") : (msg.key.participant || msg.key.remoteJid);
      const digitArg = args.map(a => String(a).replace(/\D/g, "")).find(n => n.length >= 7);
      let raw = digitArg ? `${digitArg}@s.whatsapp.net`
        : (ctx.mentionedJid && ctx.mentionedJid[0]) || ctx.participant || selfJid;
      let phoneJid = raw;
      let isLid = /@lid$/.test(raw);
      let role = "";
      if (meta && meta.participants) {
        const n = jidNumber(raw);
        const p = meta.participants.find(x => jidNumber(x.id) === n || jidNumber(x.phoneNumber || "") === n || jidNumber(x.lid || "") === n);
        if (p) {
          role = p.admin === "superadmin" ? "Group creator (super admin)" : p.admin === "admin" ? "Admin" : "Member";
          if (p.phoneNumber && /@s\.whatsapp\.net$/.test(p.phoneNumber)) { phoneJid = p.phoneNumber; isLid = false; }
          else if (/@s\.whatsapp\.net$/.test(p.id || "")) { phoneJid = p.id; isLid = false; }
        }
      }
      const number = jidNumber(phoneJid);
      const lookupJid = isLid ? phoneJid : `${number}@s.whatsapp.net`;
      const T = (p, ms = 8000) => Promise.race([Promise.resolve(p), new Promise((_, r) => setTimeout(() => r(new Error("timeout")), ms))]);

      let exists = null, about = "", aboutAt = "", pic = "", biz = null, name = "";
      if (!isLid) {
        try { const r = await T(sock_.onWhatsApp(number)); exists = !!(r && r[0] && r[0].exists); } catch {}
      }
      try {
        const r = await T(sock_.fetchStatus(lookupJid));
        const st = Array.isArray(r) ? (r[0]?.status ?? r[0]) : (r?.status ?? r);
        about = String((st && typeof st === "object" ? st.status : st) || "").trim();
        const at = st && typeof st === "object" ? st.setAt : null;
        if (at) aboutAt = new Date(at).toISOString().slice(0, 10);
      } catch {}
      try { pic = (await T(sock_.profilePictureUrl(lookupJid, "image"))) || ""; } catch {}
      try { biz = await T(sock_.getBusinessProfile(lookupJid)); } catch {}
      if (jidNumber(raw) === jidNumber(selfJid) && msg.pushName) name = msg.pushName;
      else { try { const c = sock_.store?.contacts?.[lookupJid] || sock_.store?.contacts?.[raw]; name = (c && (c.name || c.notify || c.verifiedName)) || ""; } catch {} }

      const lines = ["🔍 *WHOIS*"];
      if (name) lines.push(`📛 Name: ${name}`);
      lines.push(isLid ? "📞 Number: hidden (WhatsApp privacy ID)" : `📞 Number: +${number}`);
      const country = isLid ? "" : countryFromNumber(number);
      if (country) lines.push(`🌍 Country: ${country}`);
      if (exists !== null) lines.push(`✅ On WhatsApp: ${exists ? "Yes" : "No"}`);
      lines.push(`💬 About: ${about || "— (empty or private)"}`);
      if (aboutAt) lines.push(`🕒 About set: ${aboutAt}`);
      if (biz && (biz.description || biz.category || biz.website?.length || biz.email || biz.address)) {
        lines.push("🏢 *Business account*");
        if (biz.category) lines.push(`   • Category: ${biz.category}`);
        if (biz.description) lines.push(`   • ${String(biz.description).slice(0, 200)}`);
        if (biz.website && biz.website.length) lines.push(`   • Web: ${[].concat(biz.website)[0]}`);
        if (biz.email) lines.push(`   • Email: ${biz.email}`);
        if (biz.address) lines.push(`   • Address: ${biz.address}`);
      }
      if (role) lines.push(`👑 In this group: ${role}`);
      if (!isLid) lines.push(`🔗 https://wa.me/${number}`);
      const caption = lines.join("\n");
      if (pic) {
        try { await sock_.sendMessage(jid, { image: { url: pic }, caption }, { quoted: msg }); return { __done: true, value: (true) }; } catch {}
      }
      await send(caption + "\n🖼️ Profile photo: hidden or not set");
    } catch (e) {
      await send(`❌ Whois failed: ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
