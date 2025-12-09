// api/create-payment.ts

import { mollie } from "../mollieClient";

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { cart } = req.body;

  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: "Invalid cart" });
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);

  try {
    const payment = await mollie.payments.create({
      amount: {
        currency: "EUR",
        value: total
      },
      description: cart.map(i => `${i.name} x${i.qty}`).join("; "),
     redirectUrl: `https://pfalzventure.github.io/pending.html?id=${payment.id}`,
      webhookUrl: "https://mollie-backend-one.vercel.app/api/webhook"
    });

    return res.status(200).json({
      checkoutUrl: payment.getCheckoutUrl()
    });

  } catch (err: any) {
    console.error("Payment error:", err);
    return res.status(500).json({
      error: "Payment creation failed",
      detail: err.message
    });
  }
}
