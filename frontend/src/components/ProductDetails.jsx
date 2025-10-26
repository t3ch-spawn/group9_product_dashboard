import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "./useFetch";
import LoadingImg from "./LoadingImg";
import Loader from "./Loader";
import { formatCurrency } from "./Dashboard";
import { broadcast } from "./AppContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const { data: productRaw, refetch } = useFetch(`/products/${id}`);
  useEffect(() => {
    if (productRaw) {
      setProduct(productRaw[0]);
    }
  }, [productRaw]);
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

  console.log(product)

  return product ? (
    <main className="text-black bg-[#F5F7F8] min-h-[100vh] p-[50px] flex w-full justify-between gap-[50px]">
      {/* Container for product name, cost price and selling price */}
      <div className="flex flex-col min-w-[400px] items-start gap-[20px] bg-white w-fit border-slate-300 p-[20px] border rounded-[12px] ">
        {/* Image */}
        <LoadingImg
          src={product.img_url}
          className="size-[350px] rounded-[14px] border-slate-300 border"
        />

        {/* Container for name and category */}
        <div>
          {/* Name of product */}
          <h2 className="text-[24px] font-bold tracking-tight">
            {product.title}
          </h2>

          {/* Category */}
          <p className="text-slate-400 mt-[0px]">
            Category: {product.category}
          </p>
        </div>

        {/* Container for cost and selling price */}
        <div className="w-full text-[14px] flex flex-col gap-[4px]">
          (Per unit)
          <div className="w-full flex justify-between items-center ">
            <p>Cost price:</p>
            <p>{formatCurrency(product.cost_price)}</p>
          </div>
          <div className="w-full flex justify-between items-center">
            <p>Selling price:</p>
            <p>{formatCurrency(product.selling_price)}</p>
          </div>
          <div className="w-full flex justify-between items-center">
            <p>Holding Cost:</p>
            <p>{formatCurrency(product.holding_cost)}</p>
          </div>
        </div>
      </div>

      {/*  */}
      {/*  */}
      {/* Container showing sales, profit, stock and inventory details */}
      <div className="w-[60%]">
        {/* Top part with blue cards */}
        <div className="flex flex-col w-full gap-[30px]">
          <div className="flex gap-[30px]">
            <StatCard title="Units Sold" stat={product.units_sold} />
            <StatCard title="Revenue" stat={formatCurrency(product.revenue)} />
          </div>
          <div className="flex gap-[30px]">
            <StatCard title="Profit" stat={formatCurrency(product.profit)} />
            <StatCard
              title="Profit Margin"
              stat={`${product.profit_margin}%`}
            />
          </div>
          <StatCard title="Units in Stock" stat={product.units_in_stock} />
        </div>

        {/* Bottom part with inventory details */}
        <div className="bg-white rounded-[14px] border border-slate-300 p-[20px] mt-[50px]">
          <h3 className="text-[20px] font-bold tracking-tight">
            Inventory Details
          </h3>

          {/* Container for details */}

          <div className="flex flex-wrap gap-y-[20px]">
            {/* Total Holding Cost */}
            <div className="min-w-[50%] mt-[20px]">
              <p>Total Holding Cost</p>
              <p className="text-[18px] font-bold tracking-tight mt-[3px]">
                {formatCurrency(product.total_holding_cost)}
              </p>
            </div>

            {/* Stock Value */}
            <div className="min-w-[50%]">
              <p>Stock Value</p>
              <p className="text-[18px] font-bold tracking-tight  mt-[3px]">
                {formatCurrency(product.stock_value)}
              </p>
            </div>

            {/* Reorder point */}
            <div className="min-w-[50%]">
              <p>Reorder point</p>
              <p className="text-[18px] font-bold tracking-tight  mt-[3px]">
                {product.reorder_point} units
              </p>
            </div>

            {/* Reorder status */}
            <div className="min-w-[50%]">
              <p>Reorder status</p>
              {product.need_reorder === "yes" ? (
                <p className="text-red-600 text-[18px] font-bold tracking-tight  mt-[3px]">
                  Reorder Needed
                </p>
              ) : (
                <p className="text-green-600 text-[18px] font-bold tracking-tight  mt-[3px]">
                  Stock Sufficient
                </p>
              )}
            </div>

            {/* Stock out risk */}
            <div className="min-w-[50%]">
              <p>Stock Out Risk</p>
              <p className="text-[18px] font-bold tracking-tight  mt-[3px]">
                {product.stock_out_risk < 0 ? "0" : product.stock_out_risk} %
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  ) : (
    <main className="min-h-[100vh] w-full flex justify-center items-center">
      <Loader />
    </main>
  );
}

function StatCard({ title, stat }) {
  return (
    <div className="bg-[#DDEAF7] rounded-[8px] w-full p-[15px] text-blue1">
      {/* Title */}
      <h3 className="text-[18px] tracking-tight">{title}</h3>

      <p className="text-[20px] font-bold tracking-tight">{stat}</p>
    </div>
  );
}
