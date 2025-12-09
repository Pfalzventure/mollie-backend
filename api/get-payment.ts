import { mollie } from "../mollieClient";

export default async function handler(req, res) {
  // CORS erlauben
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  try {
    const payment = await mollie.payments.get(id);
    return res.status(200).json({ status: payment.status });
  } catch (error) {
    console.error("Error fetching payment:", error);
    return res.status(500).json({ error: error.message });
  }
}
