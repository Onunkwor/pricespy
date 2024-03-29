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
    if (priceList[i].originalPrice > highestPrice.originalPrice) {
      highestPrice = priceList[i];
    }
  }

  return highestPrice.originalPrice;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  // Filter out items with zero current price
  const filteredPriceList = priceList.filter((item) => item.currentPrice !== 0);

  // If all prices are zero or the price list is empty after filtering, return zero
  if (filteredPriceList.length === 0) {
    return 0;
  }

  // Initialize lowestPrice with the first non-zero price
  let lowestPrice = filteredPriceList[0];
  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].currentPrice < lowestPrice.currentPrice) {
      lowestPrice = priceList[i];
    }
  }

  return lowestPrice.currentPrice;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
  // Filter out items with zero current price
  const filteredPriceList = priceList.filter(
    (item) => item.originalPrice !== 0
  );

  // If all prices are zero or the price list is empty after filtering, return zero
  if (filteredPriceList.length === 0) {
    return 0;
  }

  const sumOfPrices = filteredPriceList.reduce(
    (acc, curr) => acc + curr.originalPrice,
    0
  );
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
