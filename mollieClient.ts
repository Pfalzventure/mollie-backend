// mollieClient.ts
import createMollieClient from "@mollie/api-client";

// Node env types erzwingen
// (verhindert: "Cannot find name 'process'")
declare const process: any;

export const mollie = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY,
});
