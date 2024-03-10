import ProductCard from "@/components/shared/ProductCard";
import Modal from "@/components/shared/Modal";
import PriceInfoCard from "@/components/shared/PriceInfoCard";
import { getProductByProductId, getSimilarProducts } from "@/lib/actions";
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
  if (!product) redirect("/");
  const similarProduct = await getSimilarProducts(id);
  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="flex items-center justify-center">
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
              <p className="text-[28px] text-secondary font-semibold text-wrap">
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
              <p className="text-sm text-black opacity-50">
                <span className="text-primary-green font-semibold">
                  {product.recommendations}%
                </span>{" "}
                of buyers have recommended this.
              </p>
            </div>
          </div>
          <div className="my-7 flex flex-col gap-5">
            <div className="gap-5 flex flex-wrap">
              <PriceInfoCard
                title="Current Price"
                iconSrc="/assets/icons/price-tag.svg"
                value={`${product.currency} ${product.currentPrice}`}
                borderColor="#b6dbff"
              />
              <PriceInfoCard
                title="Average Price"
                iconSrc="/assets/icons/chart.svg"
                value={`${product.currency} ${product.averagePrice}`}
                borderColor="#b6dbff"
              />
              <PriceInfoCard
                title="Highest Price"
                iconSrc="/assets/icons/arrow-up.svg"
                value={`${product.currency} ${product.highestPrice}`}
                borderColor="#b6dbff"
              />
              <PriceInfoCard
                title="Lowest Price"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`${product.currency} ${product.lowestPrice}`}
                borderColor="#b6dbff"
              />
            </div>
          </div>
          <Modal productId={id} />
        </div>
      </div>
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl text-secondary font-semi-bold">
            Product Description
          </h3>
          <ul className="flex flex-col gap-4 px-4">
            {product.description.map((item, index) => {
              return (
                <li key={index} className="list-disc">
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
        <button className="btn w-fit mx-auto flex items-center">
          <Image src="/assets/icons/bag.svg" alt="bag" width={22} height={22} />{" "}
          <Link href={product.productUrl} target="_blank">
            Buy Now
          </Link>
        </button>
      </div>
      {similarProduct && similarProduct?.length > 0 && (
        <div className="py-14 flex flex-col gap-2 w-full">
          <p className="section-text">Similar Products</p>

          <div className="flex flex-wrap gap-10 mt-7 w-full">
            {similarProduct.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
