"use client";
import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data interface
type Data = {
  name?: string;
  amt: number;
};

type SalesData = {
  transaction_date: string;
  total_amount: string;
};

interface SalesGraphProps {
  data: SalesData[];
  stroke?: string;
  fill?: string;
  type?: "linear" | "monotone";
  nameKeyX?: string;
  nameKeyY?: string;
  fontSizeX?: number;
  fontSizeY?: number;
  viewInterval?: "days" | "weeks" | "months"; // View interval: days, weeks, or months
}

function SalesGraph({
  data,
  stroke = "#5c56c1",
  fill = "#bbcbee",
  type = "linear",
  nameKeyX = "name",
  nameKeyY = "amt",
  fontSizeX = 10,
  fontSizeY = 10,
  viewInterval = "days", // Default view is in days
}: SalesGraphProps) {
  const [processedData, setProcessedData] = useState<Data[]>([]);

  // Function to process sales data and group it by the selected interval (days, weeks, or months)
  const processData = (
    rawData: SalesData[],
    interval: "days" | "weeks" | "months"
  ) => {
    const groupedData: { [key: string]: number } = {};

    rawData.forEach((item) => {
      const date = new Date(item.transaction_date);
      let key = "";
      if (interval === "months") {
        // Group by month: YYYY-MM
        key = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? "0" : ""}${
          date.getMonth() + 1
        }`;
      } else if (interval === "weeks") {
        // Group by week: YYYY-WW (ISO week number)
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const weekNumber = Math.ceil(
          ((date.getTime() - startOfYear.getTime()) / (1000 * 3600 * 24) + 1) /
            7
        );
        key = `${date.getFullYear()}-W${weekNumber}`;
      } else {
        // Group by day: YYYY-MM-DD
        key = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? "0" : ""}${
          date.getMonth() + 1
        }-${date.getDate() < 10 ? "0" : ""}${date.getDate()}`;
      }

      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
      groupedData[key] += parseFloat(item.total_amount); // Add the sales to the group
    });

    // Convert the grouped data into an array and sort by date (descending)
    const result = Object.keys(groupedData)
      .map((key) => ({
        name: key,
        amt: groupedData[key],
      }))
      .sort((a, b) => new Date(b.name).getTime() - new Date(a.name).getTime()); // Sort descending by date

    return result;
  };

  useEffect(() => {
    if (data.length > 0) {
      setProcessedData(processData(data, viewInterval));
    }
  }, [data, viewInterval]);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={processedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={nameKeyX}
            tick={{ fontSize: fontSizeX }}
            tickLine={false}
            tickSize={1}
            stroke="#a09fa2"
          />
          <YAxis
            tick={{ fontSize: fontSizeY }}
            tickLine={false}
            tickSize={1}
            stroke="#a09fa2"
            dataKey={nameKeyY}
          />
          <Tooltip />
          <Area
            type={type}
            dataKey={nameKeyY} // Change this to amt for the Y-axis
            stroke={stroke}
            fill={fill}
            fillOpacity={0.5}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesGraph;
