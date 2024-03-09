"use client";
import { scrapeAndStoreProduct } from "@/lib/actions";
import { Product } from "@/types";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const isValidAmazonProductUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;
      if (
        hostname.includes("amazon.com") ||
        hostname.includes("amazon.") ||
        hostname.includes("amazon")
      ) {
        return true;
      }
    } catch (error) {
      return false;
    }
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidLink = isValidAmazonProductUrl(query);
    if (!isValidLink) return alert("Please provide a valid amazon link");
    try {
      setLoading(true);

      //Scrape product
      const product = await scrapeAndStoreProduct(query);
      if (!product) {
        toast.error("Failed to fetch product. Please try a different URL.");
      } else {
        // Convert Mongoose document to plain object
        let id = product._id.toString();
        redirect(`/products/${id}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mt-12">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
      />
      <button type="submit" className="searchbar-btn" disabled={query === ""}>
        {loading ? "Searching..." : "Search"}
      </button>
      <p className="text-xs font-bold opacity-50">
        Note: Some Amazon product pages may not be compatible with our scraper.
        If you encounter issues with books, please try a different product
        category or provide a direct link to the product.
      </p>
    </form>
  );
};

export default SearchBar;
