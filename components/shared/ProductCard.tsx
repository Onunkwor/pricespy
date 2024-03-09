import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProductProps {
  product: Product;
}
const ProductCard = ({ product }: ProductProps) => {
  return (
    <Link href={`/products/${product._id}`} className="product-card">
      <div className="product-card_img-container flex items-center justify-center">
        <Image
          src={product.image}
          alt="product image"
          width={200}
          height={200}
        />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="product-title">{product.title}</h3>
        <div className="flex justify-between items-center">
          <p className="text-black opacity-50 text-sm capitalize">
            {product.category}
          </p>
          <p className="text-black text-lg flex font-semibold">
            <span>{product?.currency}</span>
            <span>{product?.currentPrice}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
