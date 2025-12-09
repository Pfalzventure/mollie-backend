// /api/webhook.ts

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "@vercel/kv";
import { mollie } from "../mollieClient"; // ← unverändert, wie bei dir vorhanden

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // --- CORS (falls benötigt) ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  // -----------------------------

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const paymentId = req.body?.id;

  // Mollie erwartet immer 200 – auch wenn ID fehlt
  if (!paymentId) {
    console.warn("Webhook received without payment id");
    return res.status(200).end();
  }

  try {
    // Status von Mollie abfragen
    const payment = await mollie.payments.get(paymentId);

    const status = payment.status;

    console.log(`Webhook: Payment ${paymentId} status = ${status}`);

    // Status in KV speichern
    // Beispiel-Key: payment:tr_test_ABC123
    await kv.set(`payment:${paymentId}`, status);

  } catch (error) {
    console.error("Webhook error:", error);
    // Mollie verlangt trotzdem 200
  }

  return res.status(200).end();
}
