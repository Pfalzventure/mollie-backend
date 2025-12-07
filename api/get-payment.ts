// api/get-payment.ts
import { mollie } from "../mollieClient";

export default async function handler(req: any, res: any) {
  const paymentId = req.query.id as string;

  if (!paymentId) return res.status(400).json({ error: "Payment ID fehlt" });

  try {
    const payment = await mollie.payments.get(paymentId);
    res.status(200).json({ status: payment.status });
  } catch (e: any) {
    console.error("Error fetching payment:", e);
    res.status(500).json({ error: e.message });
  }
}
