import ProductCard from "@/components/shared/ProductCard";
import HeroCarousel from "@/components/shared/HeroCarousel";
import SearchBar from "@/components/shared/SearchBar";
import { getAllProducts } from "@/lib/actions";
import Image from "next/image";

const Home = async () => {
  const allProducts = await getAllProducts();
  return (
    <>
      <section className="px-6 md:px-20 py-20">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Smart Shopping Starts Here
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow"
                width={16}
                height={16}
              />
            </p>
            <h1 className="head-text">
              Unleash the Power of{" "}
              <span className="text-primary">PriceSpy</span>
            </h1>
            <p className="mt-6">
              Powerful, self-serve product and growth analytics to help you
              convert, engage, and retain more.
            </p>
            <SearchBar />
          </div>
          <HeroCarousel />
        </div>
      </section>

      <section className="trending-section">
        <h2 className="section-text">Trending</h2>
        <div className="flex flex-wrap gap-x-14 gap-y-16 mx-auto justify-center">
          {allProducts?.map((product) => (
            <ProductCard product={product} key={product._id} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
