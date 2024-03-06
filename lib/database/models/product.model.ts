import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productUrl: { type: String, required: true, unique: true },
    currency: { type: String, required: true },
    image: { type: String, required: true },
    title: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    averagePrice: { type: Number },
    priceHistory: [
      {
        price: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    lowestPrice: { type: Number },
    highestPrice: { type: Number },
    discountRate: { type: Number },
    description: { type: Array<string> },
    category: { type: String },
    reviewsCount: { type: Number },
    stars: { type: Number },
    isOutOfStock: { type: Boolean, default: false },
    users: [
      {
        email: { type: String, required: true, default: [] },
      },
    ],
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
