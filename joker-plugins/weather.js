// Joker plugin: weather  — commands: weather
// (extracted from routes/pairing.js line 9110; behaviour unchanged)
import axios from "axios";

export default {
  name: "weather",
  aliases: ["weather"],
  order: 9110,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "weather");
  },
  async run(__ctx) {
    const { args, send } = __ctx;
    const city = args.join(" ").trim();
    if (!city) { await send("❌ Usage: .weather <city>"); return { __done: true, value: (true) }; }
    try {
      const g = await axios.get("https://geocoding-api.open-meteo.com/v1/search", {
        params: { name: city, count: 1, language: "en", format: "json" },
        timeout: 12000, validateStatus: () => true
      });
      const place = g.data?.results?.[0];
      if (!place) { await send("❌ City not found."); return { __done: true, value: (true) }; }
      const w = await axios.get("https://api.open-meteo.com/v1/forecast", {
        params: { latitude: place.latitude, longitude: place.longitude, current_weather: true },
        timeout: 12000, validateStatus: () => true
      });
      const c = w.data?.current_weather;
      if (!c) { await send("❌ Weather unavailable."); return { __done: true, value: (true) }; }
      await send(`🌤️ *${place.name}, ${place.country || ""}*\nTemp: *${c.temperature}°C*\nWind: *${c.windspeed} km/h*\nTime: ${c.time}`);
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
