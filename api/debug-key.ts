export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  return res.status(200).json({
    keyLoadedInBackend: process.env.MOLLIE_API_KEY ? 
      process.env.MOLLIE_API_KEY.substring(0, 6) + "..." : 
      "NOT FOUND"
  });
}
