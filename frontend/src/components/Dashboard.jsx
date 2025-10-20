import React from "react";

export default function Dashboard() {
  return (
    <main className="bg-[#F5F7F8] min-h-[100vh] w-full py-[40px]">
      <div className="max-w-[1280px] mx-auto">
        {/* Dashboard title */}
        <div>
          <h1 className="text-[36px] font-semibold tracking-tight">Dashboard</h1>
          <p className="text-gray leading-[110%]">
            Overview of your sales, inventory, and product performance within the past month
          </p>
        </div>

        {/* Container for numeric stats */}
        <div className="flex gap-[20px] flex-wrap items-center mt-[40px]">
          <NumericCard />
          <NumericCard />
          <NumericCard />
          <NumericCard />
          <NumericCard />
          <NumericCard />
          <NumericCard />
        </div>


        {/* Container for graphs and charts */}
        <div className="mt-[40px]">
          <h2 className="text-[30px] font-semibold tracking-tight">Key Performance Indicators</h2>

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

function NumericCard({ title, stat }) {
  return (
    <div className="flex flex-col items-start p-[15px] rounded-[8px] px-[30px] bg-white">
      <h3 className="text-gray text-sm">{title}Total Sales</h3>
      <p className="text-[24px] font-bold tracking-tight">{stat} $2,345,678</p>
    </div>
  );
}
