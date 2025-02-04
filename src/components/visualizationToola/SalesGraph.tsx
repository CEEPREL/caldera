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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="" tick={false} stroke="#a09fa2" />
          <YAxis tick={false} stroke="#a09fa2" />
          <Tooltip />
          <Area
            type="linear"
            dataKey="amt"
            stroke="#751fe4"
            fill="#bbcbee"
            fillOpacity={0.5}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesGraph;
