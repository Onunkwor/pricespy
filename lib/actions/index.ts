"use server";

import { scrapeAmazonProduct } from "../scrapper";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;
  try {
    const scrapedProduct = await scrapeAmazonProduct(productUrl);
    if (!scrapeAmazonProduct) return;
  } catch (error) {
    console.log("Failed to scrape product", error);
  }
}
