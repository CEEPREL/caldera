"use client";

import React from "react";

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface PurchaseOrderTableProps {
  columns: Column[];
  data: any;
  onActionClick?: (row: any) => void;
}

function PurchaseOrderTable({ columns, data }: PurchaseOrderTableProps) {
  if (!data || data.length === 0) {
    return <p>No Record found Select another Category</p>;
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
