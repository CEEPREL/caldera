"use client";

import React from "react";

// Define types for columns and props
interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface PurchaseOrderTableProps {
  columns: Column[];
  data: any[];
  onActionClick?: (row: any) => void;
}

function DailySalesRec({ columns, data }: PurchaseOrderTableProps) {
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
          {data.length > 0 ? (
            data.map((row: any, rowIndex: number) => (
              <tr key={rowIndex} className="border-b">
                {columns.map((column) => (
                  <td key={column.key} className="p-2">
                    {column.render
                      ? column.render(row)
                      : typeof row[column.key] === "string"
                      ? row[column.key].charAt(0).toUpperCase() +
                        row[column.key].slice(1).toLowerCase()
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-2 text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DailySalesRec;
