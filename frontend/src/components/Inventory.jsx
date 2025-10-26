import React, { useEffect, useState } from "react";
import { useFetch } from "./useFetch";
import Navbar from "./Navbar";
import LoadingImg from "./LoadingImg";
import { broadcast, useApp } from "./AppContext";

export default function Inventory() {
  const { data: allProducts, refetch } = useFetch("/products");

  useEffect(() => {
    const listener = (event) => {
      if (event.data.type === "REFRESH_PRODUCTS") {
        // Re-fetch your data here
        refetch();
      }
    };

    broadcast.addEventListener("message", listener);

    const handlePageShow = () => {
      refetch();
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      broadcast.removeEventListener("message", listener);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);
  return (
    <main className="bg-[#F5F7F8]">
      <Navbar />
      {/* Container for available products */}
      <div className="mx-auto max-w-[1000px] ml-auto pr-[30px] my-[20px]">
        <h2 className="text-[36px] mb-[40px] mx-auto w-fit font-semibold tracking-tight">
          Available Products
        </h2>

        {/* Container for list of products */}
        <div className="flex flex-wrap gap-[20px] justify-center ">
          {allProducts &&
            allProducts.map((product) => {
              return <ProductCard {...product} />;
            })}
        </div>
      </div>
    </main>
  );
}

function ProductCard({
  title,
  category,
  units_in_stock,
  need_reorder,
  img_url,
}) {
  return (
    <div className="rounded-[14px] min-w-[400px] h-fit shadow-md p-[15px] flex justify-start items-center ">
      {/* Container for image */}
      <div className="size-[150px] overflow-hidden border border-slate-300 rounded-[8px] mr-[20px]">
        <LoadingImg
          src={img_url}
          alt="product"
          className="h-full w-full object-cover object-top overflow-hidden"
        />
      </div>

      {/* Container for stats of products */}
      <div className="h-fit flex flex-col">
        {/* Title */}
        <h3 className="text-[20px] font-bold tracking-tight leading-[140%]">
          {title}
        </h3>

        {/* Category */}
        <p className="text-gray text-[15px] leading-[120%]">
          Category: {category}
        </p>

        {/* in stock */}
        <p className="text-gray text-[15px] leading-[120%]">
          In Stock:{" "}
          <span
            className={`font-bold ${
              need_reorder === "yes" ? "text-red-600" : "text-green-600"
            }`}
          >
            {units_in_stock}
          </span>
        </p>

        <a
          className="text-blue1 text-[14px] tracking-tight font-bold mt-[20px]"
          href={`/products/${title}`}
        >
          View Details
        </a>
      </div>
    </div>
  );
}
