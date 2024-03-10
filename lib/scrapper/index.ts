"use server";
import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractPrice } from "../utils";

export async function scrapeAmazonProduct(productUrl: string) {
  if (!productUrl) {
    console.log("Invalid product url");
    return;
  }
  try {
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
    // Fetch the product page
    const response = await axios.get(productUrl, options);
    const $ = cheerio.load(response.data);

    // Wait for priceArr to become available
    let priceArr: string[] = [""];
    const priceSelectors = [
      "#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center.aok-relative",
      "#corePriceDisplay_mobile_feature_div > div.a-section.a-spacing-none.aok-align-center.aok-relative",
    ];
    let attempts = 0;
    const maxAttempts = 20; // Set a maximum number of attempts

    while (priceArr[0] === "" && attempts <= maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
      for (const selector of priceSelectors) {
        const priceElement = $(selector);
        if (priceElement.length > 0) {
          priceArr = priceElement
            .text()
            .trim()
            .split(/\s{3,}/)
            .slice(0)
            .join("")
            .split(" ")
            .filter(
              (num) => num !== "with" && num !== "percent" && num !== "savings"
            );
          break;
        }
      }
      attempts++;
    }
    if (priceArr[1] === "") {
      return;
    }
    // Extract other data after priceArr is available
    const title = $("#productTitle").text().trim();
    const discountRate = priceArr[1] ? parseInt(priceArr[1]) : 0;
    const currentPriceText = priceArr[0]
      .split("")
      .slice(1)
      .filter((item) => item !== ",")
      .join("");
    const currentPrice = isNaN(parseFloat(currentPriceText))
      ? 0
      : Number(parseFloat(currentPriceText).toFixed(2));
    const originalPrice = (currentPrice / (1 - discountRate / 100)).toFixed(2);
    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";
    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";
    const currency = extractCurrency($(".a-price-symbol"));
    const category = $("span.a-list-item a.a-link-normal.a-color-tertiary")
      .text()
      .trim()
      .replace(/[\n+]/g, "")
      .split(/\s{2,}/)
      .filter((word) => word.trim() !== "")
      .slice(-2)
      .join("");
    const reviewsCount = $("#acrCustomerReviewText")
      .text()
      .trim()
      .replace(/[,]/g, "")
      .split(" ")
      .slice(0, 1)
      .join("");
    const starsFloat = parseFloat(
      $('[data-hook="rating-out-of-text"]')
        .text()
        .trim()
        .split(" ")
        .slice(0, 1)
        .join("")
    );
    const stars = Math.round(starsFloat);
    const imageUrls = Object.keys(JSON.parse(images));
    const description = $("#feature-bullets")
      .text()
      .trim()
      .replace(/[n]/g, "")
      .split(/\s{2,}/)
      .slice(1)
      .filter((desc) => desc !== "Show more");
    const descAlt = $("ul.a-unordered-list.a-vertical .a-list-item")
      .text()
      .trim()
      .replace(/[\n+]/g, "")
      .split(/\s{4,}/)
      .slice(0, 1)
      .join("")
      .split(".");
    const recommendationText = $("#histogramTable td.a-text-right.a-nowrap")
      .text()
      .trim()
      .split("%")[0];
    const recommendations = parseInt(recommendationText);

    // Construct data object with scrapped information
    const data = {
      productUrl,
      currency: currency || "$",
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice),
      originalPrice: Number(originalPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category,
      reviewsCount: Number(reviewsCount),
      stars: Number(stars) || 0,
      isOutOfStock: outOfStock,
      description:
        description.length > 0
          ? description
          : descAlt.length > 0
          ? descAlt
          : ["Check website for Product Details"],
      lowestPrice: Number(currentPrice),
      highestPrice: Number(originalPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
      recommendations,
      priceArr,
    };
    console.log(data);
    return data;
  } catch (error) {
    console.log("Failed to scrape from bright data", error);
  }
}
