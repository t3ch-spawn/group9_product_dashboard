import React, { useEffect, useState } from "react";
import { useFetch } from "./useFetch";
import Navbar from "./Navbar";
import { broadcast } from "./AppContext";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  YAxis,
  Tooltip,
  Pie,
  PieChart,
  Cell,
} from "recharts";

export default function Dashboard() {
  const { data: allMetrics, refetch } = useFetch("/products/all_metrics");
  const [profitable, setProfitable] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stockValue, setStockValue] = useState([]);
  const [reorders, setReorders] = useState([]);
  const [revCost, setRevCost] = useState([]);

  function loadContent() {
    const allGraphs = allMetrics.graphs;

    const profits = allGraphs.top_profitable.map((prod) => {
      return {
        profit: prod.profit,
        title: prod.title,
      };
    });

    console.log(allGraphs);

    setCategories(allGraphs.categories);
    setStockValue(allGraphs.stock_value);
    setReorders(allGraphs.reorders);
    setRevCost(allGraphs.revenue_totalcost);
    setProfitable(profits);
  }

  useEffect(() => {
    const listener = (event) => {
      if (event.data.type === "REFRESH_PRODUCTS") {
        refetch();
      }
    };

    broadcast.addEventListener("message", listener);

    const handlePageShow = () => {
      refetch();
    };

    if (allMetrics) loadContent();
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      broadcast.removeEventListener("message", listener);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [allMetrics]);

  function formatLargeNumber(num) {
    let value, suffix;

    if (num >= 1_000_000_000) {
      value = num / 1_000_000_000;
      suffix = "B";
    } else if (num >= 1_000_000) {
      value = num / 1_000_000;
      suffix = "M";
    } else if (num >= 1_000) {
      value = num / 1_000;
      suffix = "K";
    } else {
      value = num;
      suffix = "";
    }

    // Round to nearest whole number, limit to 3 digits max (e.g. 999K+ before switching to M+)
    const rounded = Math.round(value);

    return `₦${value}${suffix}`;
  }

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28EFF",
    "#FF6699",
    "#33CCFF",
    "#99CC33",
  ];

  const renderCustomLabel = (
    { cx, cy, midAngle, innerRadius, outerRadius, percent },
    font = 12
  ) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={font}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

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
            Object.entries(allMetrics.metrics).map(([key, value]) => {
              return <NumericCard title={key} stat={value} />;
            })}
        </div>

        {/* Container for graphs and charts */}
        <div className="mt-[40px]">
          <h2 className="text-[30px] font-semibold tracking-tight">
            Key Performance Indicators
          </h2>

          {/* Actual container for charts */}
          <div className="flex flex-wrap mt-[100px] gap-[40px]">
            {/* Graph for products vs profits */}
            <GraphCard title="Top Profitable Products">
              <BarChart
                margin={{ top: 20, right: 20, left: 25, bottom: 20 }}
                style={{
                  width: "90%",
                  height: "90%",
                }}
                responsive
                data={profitable}
              >
                <XAxis
                  dataKey="title"
                  angle={-20}
                  label={{
                    value: "Products",
                    position: "insideBottom",
                    offset: -15,
                  }}
                />
                <YAxis
                  tickFormatter={formatLargeNumber}
                  label={{
                    value: "Profit",
                    angle: -90,
                    offset: -15,
                    position: "insideLeft",
                  }}
                />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar radius={[10, 10, 0, 0]} dataKey="profit" fill="#0D7FF2" />
              </BarChart>
            </GraphCard>

            {/* Graph for categories vs profit */}
            <GraphCard title="Profit Trends Across Categories">
              <BarChart
                margin={{ top: 20, right: 20, left: 25, bottom: 20 }}
                style={{
                  width: "90%",
                  height: "90%",
                }}
                responsive
                data={categories}
              >
                <XAxis
                  dataKey="category"
                  angle={-20}
                  label={{
                    value: "Category",
                    position: "insideBottom",
                    offset: -15,
                  }}
                />
                <YAxis
                  tickFormatter={formatLargeNumber}
                  label={{
                    value: "Profit",
                    angle: -90,
                    offset: -15,
                    position: "insideLeft",
                  }}
                />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar radius={[10, 10, 0, 0]} dataKey="profit" fill="#0D7FF2" />
              </BarChart>
            </GraphCard>

            {/* Pie chart showing stock value */}
            <GraphCard
              className="!h-[700px] !max-w-[1000px] mt-[70px]"
              title="Stock Value Distribution"
            >
              <PieChart
                style={{
                  width: "150%",
                  height: "150%",
                }}
                responsive
              >
                <Pie
                  data={stockValue}
                  dataKey="stock_value"
                  cx="50%"
                  cy="50%"
                  outerRadius="60%"
                  fill="#8884d8"
                  label={(e) => {
                    return renderCustomLabel(e, 14);
                  }}
                  labelLine={false}
                >
                  {" "}
                  {stockValue.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${props.payload.title}: ${formatCurrency(value)}`,
                    null,
                  ]}
                />
              </PieChart>
            </GraphCard>

            {/* Pie chart showing percentage of products needing reorder */}
            <GraphCard
              title="Product Reorder Distribution"
              className="mt-[100px]"
            >
              <PieChart
                style={{
                  width: "150%",
                  height: "150%",
                }}
                responsive
              >
                <Pie
                  data={reorders}
                  dataKey="count"
                  cx="50%"
                  cy="50%"
                  outerRadius="60%"
                  fill="#8884d8"
                  label={(e) => {
                    return renderCustomLabel(e, 40);
                  }}
                  labelLine={false}
                >
                  {" "}
                  {reorders.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => {
                    const { need_reorder } = props.payload;
                    return [
                      `${
                        need_reorder === "yes"
                          ? "Reorder Needed"
                          : "Stock sufficient"
                      }: ${value}`,
                      null,
                    ];
                  }}
                />
              </PieChart>
            </GraphCard>

            {/* Relationship between revenue and totalCost across Categories */}
            <GraphCard title="Relationship between Revenue and Total Cost Across Categories" className="!max-w-[1000px] mt-[90px]">
              <BarChart
                margin={{ top: 20, right: 20, left: 25, bottom: 20 }}
                style={{
                  width: "90%",
                  height: "90%",
                }}
                responsive
                data={revCost}
              >
                <XAxis
                  dataKey="category"
                  angle={-20}
                  label={{
                    value: "Category",
                    position: "insideBottom",
                    offset: -15,
                  }}
                />
                <YAxis
                  tickFormatter={formatLargeNumber}
                  label={{
                    value: "Profit",
                    angle: -90,
                    offset: -15,
                    position: "insideLeft",
                  }}
                />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar radius={[10, 10, 0, 0]} dataKey="revenue" fill="#0D7FF2" />
                <Bar
                  radius={[10, 10, 0, 0]}
                  dataKey="total_cost"
                  fill="#0D7FF2"
                />
              </BarChart>
            </GraphCard>
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
  const currency_title = [
    "Total Revenue",
    "Total Cost",
    "Avg. Holding Cost",
    "Total Stock Value",
  ];
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

function GraphCard({ children, title, className }) {
  return (
    <div className={`w-full  max-w-[550px] h-[480px] ${className}`}>
      <h2 className="text-[30px] font-medium tracking-tight mb-[20px]">
        {title}
      </h2>
      <div className="w-full bg-white border-neutral-300 border rounded-[12px] h-full flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}
