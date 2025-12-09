import { mollie } from "../mollieClient";

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // --- GET: Mollie-Probezugriffe abfangen ---
  if (req.method === "GET") {
    return res.status(200).send("Webhook online");
  }

  // --- OPTIONS ---
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // --- POST required ---
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const paymentId = req.body.id;

  // Mollie erwartet IMMER 200
  if (!paymentId) {
    return res.status(200).send("No paymentId");
  }

  try {
    const payment = await mollie.payments.get(paymentId);

    console.log("Webhook payment:", payment.id, payment.status);
  } catch (err) {
    console.error("Webhook error:", err);
  }

  return res.status(200).end();
}
