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

function SalesGraph({ data }: { data: Data[] }) {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="1 10" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="linear" dataKey="amt" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesGraph;
