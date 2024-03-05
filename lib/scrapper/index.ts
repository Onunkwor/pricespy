import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractPrice } from "../utils";
export async function scrapeAmazonProduct(productUrl: string) {
  if (!productUrl) return;

  //BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 2225;
  const session_id = (1000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };
  try {
    //fetch the product page
    const response = await axios.get(productUrl, options);
    const $ = cheerio.load(response.data);

    //Extract data
    const title = $("#productTitle").text().trim();
    const currentPriceText = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $(".a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base"),
      $(".a-price.a-text-price .a-offscreen"),
      $(".a-price-whole")
    );
    const originalPriceText = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );
    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";
    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";
    const currency = extractCurrency($(".a-price-symbol"));
    const imageUrls = Object.keys(JSON.parse(images));
    const currentPrice = parseFloat(currentPriceText).toFixed(2);
    const originalPrice = parseFloat(originalPriceText).toFixed(2);
    console.log({
      title,
      currentPrice,
      originalPrice,
      outOfStock,
      imageUrls,
      currency,
    });
  } catch (error) {
    console.log("Failed to scrape from bright data", error);
  }
}
