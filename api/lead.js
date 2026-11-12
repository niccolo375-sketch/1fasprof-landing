export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name, phone } = req.body || {};
  if (!name || !phone || String(name).trim().length > 80 || String(phone).trim().length > 30) return res.status(400).json({ error: "Invalid form data" });
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return res.status(500).json({ error: "Server is not configured" });
  const safe = (s) => String(s).replace(/[<>&]/g, "");
  const message = ["🚕 Новая заявка — ФасПроф", `Имя: ${safe(name).trim().slice(0,80)}`, `Телефон: ${safe(phone).trim().slice(0,30)}`].join("\n");
  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chatId, text: message }) });
    if (!tg.ok) return res.status(502).json({ error: "Telegram delivery failed" });
    return res.status(200).json({ ok: true });
  } catch { return res.status(502).json({ error: "Telegram request failed" }); }
}
