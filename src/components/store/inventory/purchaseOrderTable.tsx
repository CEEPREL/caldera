"use client";

import { InventoryItem } from "@/app/caldera/[storeId]/inventory/page";
import React from "react";

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface PurchaseOrderTableProps {
  columns: Column[];
  data: InventoryItem[];
  onActionClick?: (row: any) => void;
}

function PurchaseOrderTable({ columns, data }: PurchaseOrderTableProps) {
  if (!Array.isArray(data)) {
    console.error("Invalid data: Expected an array but got", typeof data);
    return <div> No data found</div>;
  }

  if (!Array.isArray(columns)) {
    console.error("Invalid columns: Expected an array but got", typeof columns);
    return <div> No data found</div>;
  }

  if (
    columns.some(
      (col) => typeof col.key !== "string" || typeof col.label !== "string"
    )
  ) {
    console.error("Invalid column structure");
    return <div> Columns structure is incorrect!</div>;
  }
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
          {data.map((row: any, rowIndex: number) => (
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
