import { VercelRequest, VercelResponse } from "@vercel/node";
import { mollie } from "../mollieClient";
import { CartItem } from "../types/cart";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cart } = req.body as { cart: CartItem[] };

  // Grundvalidierung
  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: "Invalid cart" });
  }

  // Detailvalidierung
  for (const item of cart) {
    if (
      typeof item.price !== "number" ||
      typeof item.qty !== "number" ||
      item.price <= 0 ||
      item.qty <= 0 ||
      !Number.isFinite(item.price) ||
      !Number.isInteger(item.qty)
    ) {
      return res.status(400).json({ error: "Invalid cart item values" });
    }
  }

  // Float-sichere Berechnung
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalStr = total.toFixed(2);

  try {
    const payment = await mollie.payments.create({
      amount: {
        currency: "EUR",
        value: totalStr
      },
      description: cart.map(i => `${i.name} x${i.qty}`).join("; "),
      redirectUrl: "https://DEIN-FRONTEND-DOMAIN/success.html",
      webhookUrl: "https://DEIN-BACKEND-DOMAIN/api/webhook",
      method: [
        "creditcard",
        "directdebit",
        "applepay",
        "googlepay",
        "giropay"
      ]
    });

    return res.status(200).json({ checkoutUrl: payment.getCheckoutUrl() });
  } catch (err: any) {
    return res.status(500).json({
      error: "Payment creation failed",
      detail: err.message
    });
  }
}
