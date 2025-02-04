"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Data = {
  name?: string;
  year?: number;
  uv?: number;
  sales?: number;
  pv: number;
  amt: number;
};

function SalesGraph({
  data,
  stroke = "#5c56c1",
  fill = "#bbcbee",
  type = "linear",
  nameKeyY = "",
  nameKeyX = "",
  fontSizeX = 10,
  fontSizeY = 10,
}: {
  data: Data[];
  stroke?: string;
  fill?: string;
  type?: "linear" | "monotone";
  nameKeyX?: string;
  nameKeyY?: string;
  fontSizeX?: number;
  fontSizeY?: number;
}) {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
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
            dataKey="amt"
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
