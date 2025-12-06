import { VercelRequest, VercelResponse } from "@vercel/node";
import { mollie } from "../mollieClient";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const paymentId = req.body.id;
  if (!paymentId) return res.status(200).end(); // Mollie erwartet 200 OK

  try {
    const payment = await mollie.payments.get(paymentId);
    console.log("Payment status:", payment.status);

    // Optional später:
    // if (payment.isPaid()) { ... }
    // if (payment.isCanceled()) { ... }
    // if (payment.isExpired()) { ... }
    // usw.
  } catch (e) {
    console.error("Webhook error:", e);
  }

  return res.status(200).end();
}
