import React from "react";

export default function Products() {
  return (
    <main className="bg-[#F5F7F8] min-h-[100vh] py-[40px]">
      <div className="max-w-[1280px] mx-auto">
        {/* Product page title */}
        <div>
          <h1 className="text-[36px] font-semibold tracking-tight">Products</h1>
          <p className="text-gray leading-[110%]">
            Find your next favourite product and add it to your collection
          </p>
        </div>

        {/* Container for products */}
        <div className="flex flex-wrap gap-[30px] mt-[40px]">
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
        </div>
      </div>
    </main>
  );
}

function ProductCard() {
  return (
    <div className="border border-neutral-300 rounded-[12px] w-full max-w-[250px]">
      <img className="h-[190px]" src="" alt="" />

      {/* Container for title and price */}
      <div className="flex flex-col gap-[4px] p-[15px]">
        <h3 className="font-semibold text-[18px] tracking-tight">Headphones</h3>

        {/* Price */}
        <p className="text-gray">$15.00</p>

        {/* Buy btn */}
        <button className="font-semibold tracking-tight text-white bg-[#0D7FF2] w-full h-[40px] rounded-[10px]">
          Buy
        </button>
      </div>
    </div>
  );
}
