import React from "react";
import { useFetch } from "./useFetch";
import Navbar from "./Navbar";

export default function Inventory() {
  const { data: allProducts } = useFetch("/products");
 


  return (
    <main className="bg-[#F5F7F8]">
      <Navbar />
      {/* Container for available products */}
      <div className="max-w-[1000px] ml-auto pr-[30px] my-[20px]">
        <h2 className="text-[36px] font-semibold tracking-tight">
          Available Products
        </h2>

        {/* Container for list of products */}
        <div className="flex flex-col gap-[20px]">
          {allProducts &&
            allProducts.map((product) => {
              return <ProductCard {...product} />;
            })}
        </div>
      </div>
    </main>
  );
}

function ProductCard({ title, category, units_in_stock, need_reorder }) {
  return (
    <div className="rounded-[14px] h-fit shadow-md p-[15px] flex justify-start items-center ">
      {/* Container for image */}
      <div className="size-[150px] border rounded-[8px] mr-[20px]"></div>

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
