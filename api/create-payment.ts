// api/create-payment.ts

import { mollie } from "../mollieClient";

// Node env types erzwingen
declare const process: any;

export default async function handler(req: any, res: any) {
  try {
    const { amount, description, redirectUrl } = req.body;

    const payment = await mollie.payments.create({
      amount: {
        currency: "EUR",
        value: amount,
      },
      description,
      redirectUrl,
      method: [
        "creditcard",
        "directdebit",
        "applepay",
        "googlepay",
        "giropay",
      ],
    });

    // TypeScript ignorieren → Mollie-API liefert _links sicher zurück
    // und verhindert den Fehler: "_links does not exist"
    // @ts-ignore
    const checkoutUrl = payment._links.checkout.href;

    return res.json({ url: checkoutUrl });
  } catch (error: any) {
    console.error("Payment error:", error);
    return res.status(500).json({ error: error.message });
  }
}
