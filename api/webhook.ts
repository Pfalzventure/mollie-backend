import { VercelRequest, VercelResponse } from "@vercel/node";
import { mollie } from "../mollieClient";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const paymentId = req.body.id;
  if (!paymentId) return res.status(400).end();

  try {
    const payment = await mollie.payments.get(paymentId);

    // Hier kannst du später: E-Mail, Downloads, Rechnungen, etc. auslösen
    console.log("Payment status:", payment.status);

    return res.status(200).end();
  } catch (e) {
    return res.status(500).end();
  }
}
