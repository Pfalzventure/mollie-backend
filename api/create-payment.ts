import { mollie } from "../mollieClient";

declare var process: any;

export default async function handler(req: any, res: any) {
  // --- CORS ---
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
    // 1️⃣ Payment OHNE redirectUrl erzeugen
    const payment = await mollie.payments.create({
      amount: {
        currency: "EUR",
        value: totalStr
      },
      description: cart.map(i => `${i.name} x${i.qty}`).join("; "),
      webhookUrl: "https://mollie-backend-one.vercel.app/api/webhook",
      method: undefined
    });

    // 2️⃣ redirectUrl NACHTRÄGLICH generieren (nur Clientseitig)
redirectUrl: "https://pfalzventure.github.io/pending.html",

    // Wenn du willst, kannst du redirectUrl im Payment updaten,
    // aber das ist für Mollie NICHT notwendig!

    // 3️⃣ Checkout-URL zurückgeben
    return res.status(200).json({
      checkoutUrl: payment.getCheckoutUrl(),
      redirectUrl
    });

  } catch (err: any) {
    console.error("Payment error:", err);
    return res.status(500).json({
      error: "Payment creation failed",
      detail: err.message
    });
  }
}
