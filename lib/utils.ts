import { PriceHistoryItem, Product } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Notification = {
  WELCOME: "WELCOME",
  CHANGE_OF_STOCK: "CHANGE_OF_STOCK",
  LOWEST_PRICE: "LOWEST_PRICE",
  THRESHOLD_MET: "THRESHOLD_MET",
};
const THRESHOLD_PERCENTAGE = 40;
export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = element.text().trim();

    if (priceText) {
      const cleanPrice = priceText.replace(/[^\d.]/g, "");

      let firstPrice;

      if (cleanPrice) {
        firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
      }

      return firstPrice || cleanPrice;
    }
  }

  return "";
}

// Extracts and returns the currency symbol from an element.
export function extractCurrency(element: any) {
  const currencyText = element.text().trim().slice(0, 1);
  return currencyText ? currencyText : "";
}
export function getHighestPrice(priceList: PriceHistoryItem[]) {
  let highestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price > highestPrice.price) {
      highestPrice = priceList[i];
    }
  }

  return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  let lowestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice.price) {
      lowestPrice = priceList[i];
    }
  }

  return lowestPrice.price;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
  const averagePrice = sumOfPrices / priceList.length || 0;

  return averagePrice;
}

export const getEmailNotificationType = (
  scrapedProduct: Product,
  currentProduct: Product
) => {
  const lowestPrice = getLowestPrice(currentProduct.priceHistory);

  if (scrapedProduct.currentPrice < lowestPrice) {
    return Notification.LOWEST_PRICE as keyof typeof Notification;
  }
  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
  }
  if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
    return Notification.THRESHOLD_MET as keyof typeof Notification;
  }
};

// const options = {
//   url: "http://lumtest.com/myip.json",
//   proxy: super_proxy,
//   rejectUnauthorized: false,
// };
// const proxyUrl = `http://${username}-session-${session_id}:${password}@brd.superproxy.io:${port}`;
//fetch the product page
// const response = await axios.get(productUrl, options);
// const $ = cheerio.load(response.data);

//Extract data
// const title = $("#productTitle").text().trim();
// console.log(title);

// const priceArr = $("#corePriceDisplay_desktop_feature_div div span")
//   .text()
//   .trim()
//   .split(/\s{4,}/)
//   .slice(0, 1)
//   .join("")
//   .split(" ")
//   .filter(
//     (num) => num !== "with" && num !== "percent" && num !== "savings"
//   );

// if (priceArr.length === 0 || priceArr[0] === "") {
//   return;
// }
// const discountRate = priceArr[1] ? parseInt(priceArr[1]) : 0;
// const currentPriceText = priceArr[0]
//   .split("")
//   .slice(1)
//   .filter((item) => item !== ",")
//   .join("");

// // Ensure currentPriceText is a valid number
// const currentPrice = isNaN(parseFloat(currentPriceText))
//   ? 0 // Assign a default value if currentPriceText is not a valid number
//   : Number(parseFloat(currentPriceText).toFixed(2));

// const originalPrice = (currentPrice / (1 - discountRate / 100)).toFixed(2);
// const outOfStock =
//   $("#availability span").text().trim().toLowerCase() ===
//   "currently unavailable";
// const images =
//   $("#imgBlkFront").attr("data-a-dynamic-image") ||
//   $("#landingImage").attr("data-a-dynamic-image") ||
//   "{}";
// const currency = extractCurrency($(".a-price-symbol"));
// const category = $("span.a-list-item a.a-link-normal.a-color-tertiary")
//   .text()
//   .trim()
//   .replace(/[\n+]/g, "")
//   .split(/\s{2,}/)
//   .filter((word) => word.trim() !== "")
//   .slice(-2)
//   .join("");
// const reviewsCount = $("#acrCustomerReviewText")
//   .text()
//   .trim()
//   .replace(/[,]/g, "")
//   .split(" ")
//   .slice(0, 1)
//   .join("");
// const starsFloat = parseFloat(
//   $('[data-hook="rating-out-of-text"]')
//     .text()
//     .trim()
//     .split(" ")
//     .slice(0, 1)
//     .join("")
// );
// const stars = Math.round(starsFloat);
// const imageUrls = Object.keys(JSON.parse(images));
// const description = $("#feature-bullets")
//   .text()
//   .trim()
//   .replace(/[n]/g, "")
//   .split(/\s{2,}/)
//   .slice(1)
//   .filter((desc) => desc !== "Show more");
// const descAlt = $("ul.a-unordered-list.a-vertical .a-list-item")
//   .text()
//   .trim()
//   .replace(/[\n+]/g, "")
//   .split(/\s{4,}/)
//   .slice(0, 1)
//   .join("")
//   .split(".");
// const recommendationText = $("#histogramTable td.a-text-right.a-nowrap")
//   .text()
//   .trim()
//   .split("%")[0];
// const recommendations = parseInt(recommendationText);
// //Construct data object with scrapped information
// const data = {
//   productUrl,
//   currency: currency || "$",
//   image: imageUrls[0],
//   title,
//   currentPrice: Number(currentPrice),
//   originalPrice: Number(originalPrice),
//   priceHistory: [],
//   discountRate: Number(discountRate),
//   category,
//   reviewsCount: Number(reviewsCount),
//   stars: Number(stars) || 0,
//   isOutOfStock: outOfStock,
//   description:
//     description.length > 0
//       ? description
//       : descAlt.length > 0
//       ? descAlt
//       : ["Check website for Product Details"],
//   lowestPrice: Number(currentPrice),
//   highestPrice: Number(originalPrice),
//   averagePrice: Number(currentPrice) || Number(originalPrice),
//   recommendations,
//   priceArr,
// };
// console.log(data);
// return data;
