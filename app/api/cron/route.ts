import Product from "@/lib/database/models/product.model";
import { connectToDB } from "@/lib/database/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scrapper";
import {
  getAveragePrice,
  getEmailNotificationType,
  getHighestPrice,
  getLowestPrice,
} from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();
    const products = await Product.find({});

    if (!products) throw new Error("Product not found");
    // 1. Scrape latest product details and update db
    const updatedProduct = await Promise.all(
      products.map(async (currentProduct) => {
        const scrapedProduct = await scrapeAmazonProduct(
          currentProduct.productUrl.toString()
        );
        if (!scrapedProduct) throw new Error("No product found");
        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          {
            currentPrice: currentProduct.currentPrice, // Use existing current price
            originalPrice: currentProduct.originalPrice, // Use existing original price
            discount: currentProduct.discountRate, // Use existing discount rate
          },
        ];
        const currentPrice = scrapedProduct.currentPrice;
        const originalPrice = scrapedProduct.originalPrice;
        const discountRate = scrapedProduct.discountRate;
        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
          currentPrice:
            currentPrice === 0
              ? updatedPriceHistory[0].currentPrice
              : currentPrice,
          originalPrice:
            originalPrice === 0
              ? updatedPriceHistory[0].originalPrice
              : originalPrice,
          discountRate:
            discountRate === 0 ? updatedPriceHistory[0].discount : discountRate,
        };
        const updatedProduct = await Product.findOneAndUpdate(
          { productUrl: product.productUrl },
          product
        );

        //2. Check Each Product's status & send email accordingly
        const emailNotificationType = getEmailNotificationType(
          scrapedProduct,
          currentProduct
        );
        if (emailNotificationType && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.productUrl,
          };
          const emailContent = await generateEmailBody(
            productInfo,
            emailNotificationType
          );
          const userEmails = updatedProduct.users.map(
            (user: any) => user.email
          );
          await sendEmail(emailContent, userEmails);
        }
        return updatedProduct;
      })
    );
    return NextResponse.json({
      message: "Ok",
      data: updatedProduct,
    });
  } catch (error) {
    console.log("Error in GET", error);
  }
}
