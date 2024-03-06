"use server";
import { revalidatePath } from "next/cache";
import Product from "../database/models/product.model";
import { connectToDB } from "../database/mongoose";
import { scrapeAmazonProduct } from "../scrapper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;
  try {
    const scrapedProduct = await scrapeAmazonProduct(productUrl);
    if (!scrapedProduct) return;
    await connectToDB();
    let product = scrapedProduct;
    let existingProduct = await Product.findOne({
      productUrl: scrapedProduct.productUrl,
    });
    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }
    const newProduct = await Product.findOneAndUpdate(
      { productUrl: scrapedProduct.productUrl },
      product,
      { upsert: true, new: true }
    );
    revalidatePath(`/products/${newProduct._id}`);
  } catch (error) {
    console.log("Failed to scrape product", error);
  }
}

export async function getProductByProductId(productId: string) {
  try {
    await connectToDB();
    const product = await Product.findOne({ _id: productId });
    if (!product) return null;
    return product;
  } catch (error) {
    console.log("Error getting product", error);
  }
}
export async function getAllProducts() {
  try {
    await connectToDB();
    const products = await Product.find();
    if (!products) return null;
    return products;
  } catch (error) {
    console.log("Error getting all products", error);
  }
}
