// api/webhook.ts

import { mollie } from "../mollieClient";

// @ts-ignore
declare const process: any;

export default async function handler(req: any, res: any) {
  
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Preflight erfolgreich
    return res.status(200).end();
  }
  // -------------

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const paymentId = req.body.id;

  // Mollie erwartet IMMER HTTP 200 – selbst wenn id fehlt
  if (!paymentId) {
    return res.status(200).end();
  }

  try {
    const payment = await mollie.payments.get(paymentId);
    console.log("Payment status:", payment.status);

    // Später hier:
    // if (payment.isPaid()) { ... }
    // if (payment.isCanceled()) { ... }
    // etc.
  } catch (e) {
    console.error("Webhook error:", e);
  }

  return res.status(200).end();
}
