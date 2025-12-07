// api/create-payment.ts

import { mollie } from "../mollieClient";

// Node env types erzwingen
declare const process: any;

export default async function handler(req: any, res: any) {
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

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalStr = total.toFixed(2);

  try {
    const payment = await mollie.payments.create({
      amount: {
        currency: "EUR",
        value: totalStr
      },
      description: cart.map(i => `${i.name} x${i.qty}`).join("; "),
      redirectUrl: "https://pfalzventure.github.io/success.html",
      webhookUrl: "https://mollie-backend-one.vercel.app/api/webhook",

      // Methoden explizit erlauben
      method: [
        "creditcard",
        "directdebit",
        "applepay",
        "googlepay",
        "giropay"
      ],
    });

    // WICHTIG: checkout URL korrekt holen
    const checkoutUrl = payment._links.checkout.href;

    return res.status(200).json({ checkoutUrl });

  } catch (err: any) {
    console.error("Payment error:", err);
    return res.status(500).json({
      error: "Payment creation failed",
      detail: err.message
    });
  }
}
