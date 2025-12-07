// api/pending-payment.ts

import { mollie } from "../mollieClient";

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ status: "error", message: "Missing paymentId" });
  }

  try {
    const payment = await mollie.payments.get(id);

    return res.status(200).json({ status: payment.status });
  } catch (e) {
    console.error("Pending error:", e);
    return res.status(200).json({ status: "error" });
  }
}
