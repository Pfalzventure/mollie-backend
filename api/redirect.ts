export default async function handler(req, res) {
  const id = req.query.id;

  if (!id) return res.redirect("https://pfalzventure.github.io/failed.html");

  const r = await fetch(`https://mollie-backend-one.vercel.app/api/get-payment?id=${id}`);
  const data = await r.json();

  if (data.status === "paid")
    return res.redirect("https://pfalzventure.github.io/success.html");

  if (data.status === "canceled" || data.status === "failed")
    return res.redirect("https://pfalzventure.github.io/failed.html");

  return res.redirect(`https://pfalzventure.github.io/pending.html?id=${id}`);
}
