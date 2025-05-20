const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/sniff", async (req, res) => {
  const address = req.query.address;
  if (!address) return res.status(400).json({ error: "Missing address" });

  try {
    const url = `https://tokensniffer.com/token/${address}`;
    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(response.data);
    const title = $("h1").text().trim();
    const score = $(".badge-score").text().trim();
    const sniffedDate = $(".text-sm.text-silver-500").first().text().trim();

    res.json({ title, score, sniffedDate });
  } catch (error) {
    res.status(500).json({ error: "Scrape failed or address invalid" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});