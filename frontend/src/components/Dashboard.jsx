import React, { useEffect } from "react";
import { useFetch } from "./useFetch";
import Navbar from "./Navbar";

export default function Dashboard() {
  const { data: allMetrics } = useFetch("/products/all_metrics");

  return (
    <main className="bg-[#F5F7F8] min-h-[100vh] w-full ">
      <Navbar />
      <div className="max-w-[1280px] mx-auto py-[40px]">
        {/* Dashboard title */}
        <div>
          <h1 className="text-[36px] font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray leading-[110%]">
            Overview of your sales, inventory, and product performance within
            the past month
          </p>
        </div>

        {/* Container for numeric stats */}
        <div className="flex gap-[20px] flex-wrap items-center mt-[40px]">
          {allMetrics &&
            Object.entries(allMetrics).map(([key, value]) => {
              return <NumericCard title={key} stat={value} />;
            })}
        </div>

        {/* Container for graphs and charts */}
        <div className="mt-[40px]">
          <h2 className="text-[30px] font-semibold tracking-tight">
            Key Performance Indicators
          </h2>

          {/* Actual container for charts */}
          <div className="flex flex-wrap gap-[40px] mt-[20px]">
            <div className="w-full max-w-[550px] border-neutral-300 border rounded-[12px] h-[380px]"></div>
            <div className="w-full max-w-[550px] border-neutral-300 border rounded-[12px] h-[380px]"></div>
            <div className="w-full max-w-[550px] border-neutral-300 border rounded-[12px] h-[380px]"></div>
            <div className="w-full max-w-[550px] border-neutral-300 border rounded-[12px] h-[380px]"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function formatCurrency(amount) {
  return amount.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function NumericCard({ title, stat }) {
  const currency_title = ["Total Revenue", "Total Cost", "Avg. Holding Cost", "Total Stock Value"];
  const isMoney = currency_title.includes(title);
  const isMargin = title === "Avg. Profit Margin";
  const isLead = title === "Avg. Lead Time";

  let formattedStat;

  if (isMoney) {
    formattedStat = formatCurrency(stat);
  } else if (isMargin) {
    formattedStat = `${stat}%`;
  } else if (isLead) {
    formattedStat = `${stat} days`;
  } else {
    formattedStat = stat;
  }

  return (
    <div className="flex flex-col items-start p-[15px] rounded-[8px] px-[30px] bg-white">
      <h3 className="text-gray text-sm">{title}</h3>
      <p className="text-[24px] font-bold tracking-tight">{formattedStat}</p>
    </div>
  );
}
