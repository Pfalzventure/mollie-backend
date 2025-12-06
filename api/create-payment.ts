import { VercelRequest, VercelResponse } from "@vercel/node";
import { mollie } from "../mollieClient";
import { CartItem } from "../types/cart";

export default async function handler(req: VercelRequest, res: VercelResponse) {

  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
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
      redirectUrl: "https://pfalzventure.github.io/success.html",
      webhookUrl: "https://mollie-backend-one.vercel.app/api/webhook",
      method: [
        "creditcard",
        "directdebit",
        "applepay",
        "googlepay",
        "giropay"
      ]
    });

   return res.status(200).json({ checkoutUrl: payment._links.checkout.href });

  } catch (err: any) {
    return res.status(500).json({
      error: "Payment creation failed",
      detail: err.message
    });
  }
}
