export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { apiKey, domain, titles, page } = req.body;
  if (!apiKey) return res.status(400).json({ error: "Missing API key" });
  if (!domain) return res.status(400).json({ error: "Missing domain" });

  try {
    const body = {
      q_organization_domains_list: [domain],
      page: page || 1,
      per_page: 100,
    };
    // If titles provided, filter by them
    if (titles && titles.length) body.person_titles = titles;

    const response = await fetch("https://api.apollo.io/v1/mixed_people/api_search", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
