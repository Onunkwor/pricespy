import { getProductByProductId } from "@/lib/actions";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
interface Props {
  params: { id: string };
}
const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductByProductId(id);
  console.log(product);

  if (!product) redirect("/");
  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div>
          <Image
            src={product.image}
            alt={product.title}
            width={400}
            height={400}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] text-secondary font-semibold">
                {product.title}
              </p>
              <Link
                href={product.productUrl}
                target="_blank"
                className="text-base text-black opacity-50"
              >
                Visit Product
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="product-hearts">
                <Image
                  src="/assets/icons/red-heart.svg"
                  alt="heart"
                  width={20}
                  height={20}
                />
                <p className="text-base font-semibold text-[#D46F77]">
                  {product.reviewsCount}
                </p>
              </div>

              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src="/assets/icons/bookmark.svg"
                  alt="Bookmark"
                  width={20}
                  height={20}
                />
              </div>
              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src="/assets/icons/share.svg"
                  alt="Bookmark"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
          <div className="product-info">
            <div className="flex flex-col gap-2">
              <p className="text-[34px] text-secondary font-semibold">
                {product.currency}
                {product.currentPrice}
              </p>
              <p className="text-[21px] text-secondary opacity-50 line-through">
                {product.currency}
                {product.originalPrice}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 items-start h-full">
                <div className="product-stars">
                  <Image
                    src="/assets/icons/star.svg"
                    alt="star"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-primary-orange font-semibold">
                    {product.stars}
                  </p>
                </div>
                <div className="product-reviews">
                  <Image
                    src="/assets/icons/comment.svg"
                    alt="comments"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-secondary font-semibold">
                    {product.reviewsCount} Reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
