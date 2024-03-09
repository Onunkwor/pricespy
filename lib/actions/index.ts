"use server";
import { revalidatePath } from "next/cache";
import Product from "../database/models/product.model";
import { connectToDB } from "../database/mongoose";
import { scrapeAmazonProduct } from "../scrapper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

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
    return newProduct.toObject();
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
    const products = await Product.find().sort({ createdAt: -1 });
    if (!products) return null;
    return products;
  } catch (error) {
    console.log("Error getting all products", error);
  }
}
export async function getSimilarProducts(productId: string) {
  try {
    await connectToDB();
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) return null;
    const similarProducts = await Product.find({
      _id: { $ne: productId },
    })
      .limit(3)
      .sort({ createdAt: -1 });
    return similarProducts;
  } catch (error) {
    console.log("Error getting all products", error);
  }
}

export async function addUserEmailToProduct(
  productId: string,
  userEmail: string
) {
  try {
    await connectToDB();
    const product = await Product.findById(productId);
    if (!product) return;
    // Validate userEmail to ensure it's a string
    if (typeof userEmail !== "string") {
      throw new Error("Invalid email address");
    }
    const userExists = product.users.some(
      (user: User) => user.email === userEmail
    );
    if (!userExists) {
      product.users.push({ email: userEmail });
      await product.save();
      const emailContent = await generateEmailBody(product, "WELCOME");
      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log("Error sending email to product", error);
  }
}
