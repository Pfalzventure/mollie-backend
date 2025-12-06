import createMollieClient from "@mollie/api-client";
console.log("Mollie API Key:", process.env.MOLLIE_API_KEY);

export const mollie = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY!
});
