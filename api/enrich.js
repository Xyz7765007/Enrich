export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { apiKey, details } = req.body;
  if (!apiKey) return res.status(400).json({ error: "Missing API key" });
  if (!details?.length) return res.status(400).json({ error: "Missing details array" });

  try {
    const response = await fetch("https://api.apollo.io/v1/people/bulk_match", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({ details }),
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch (e) {
      return res.status(500).json({ error: "Invalid JSON from Apollo", raw: text.slice(0, 500) });
    }
    if (!response.ok) return res.status(response.status).json(data);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
