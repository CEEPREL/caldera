"use client";

import React from "react";
import Image from "next/image";

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode; // Function to render UI elements
}

interface PurchaseOrderTableProps {
  columns: Column[];
  data: { [key: string]: string | number }[]; // API data (raw, no JSX)
  onActionClick?: (row: any) => void; // Client-side action handler
}

function PurchaseOrderTable({
  columns,
  data,
  onActionClick,
}: PurchaseOrderTableProps) {
  return (
    <div>
      <table className="w-full border-collapse shadow-md">
        <thead className="bg-gray-100 text-left">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="p-2">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b">
              {columns.map((column) => (
                <td key={column.key} className="p-2">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PurchaseOrderTable;
