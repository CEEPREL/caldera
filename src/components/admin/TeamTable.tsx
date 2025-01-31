import Image from "next/image";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  purchased: string;
  sellingPrice: string;
  stock: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "X650 KC2 KC8 CC7(BB4 X653)",
    purchased: "₦16,800",
    sellingPrice: "₦18,000",
    stock: 10,
  },
  {
    id: 2,
    name: "X650 KC2 KC8 CC7(BB4 X653)",
    purchased: "₦16,800",
    sellingPrice: "₦18,000",
    stock: 0,
  },
  {
    id: 3,
    name: "BF7",
    purchased: "₦16,800",
    sellingPrice: "₦18,000",
    stock: 10,
  },
  {
    id: 4,
    name: "J7 Prime Gold",
    purchased: "₦16,800",
    sellingPrice: "₦18,000",
    stock: 1,
  },
  {
    id: 5,
    name: "iPhone 6s",
    purchased: "₦16,800",
    sellingPrice: "₦18,000",
    stock: 10,
  },
  {
    id: 6,
    name: "S17",
    purchased: "₦16,800",
    sellingPrice: "₦18,000",
    stock: 0,
  },
  {
    id: 7,
    name: "BE6",
    purchased: "₦16,800",
    sellingPrice: "₦18,000",
    stock: 10,
  },
];

export default function TeamTable() {
  const [data, setData] = useState(products);
  const [extraRows, setExtraRows] = useState(0);

  const handleAddRow = () => {
    setExtraRows(extraRows + 1);
  };

  const handleDeleteRow = (id: number) => {
    setData(data.filter((product) => product.id !== id));
  };

  return (
    <div className="">
      <table className="w-full border-collapse border border-gray-300 shadow-md">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Product</th>
            <th className="border p-2">Purchased</th>
            <th className="border p-2">Selling Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product, index) =>
            product.name ? (
              <tr key={product.id} className="border">
                <td className=" text-gray-400 text-xs flex w-14 p-2">
                  <span className="text-black pr-1">
                    {" "}
                    <input className="" type="checkbox" />
                  </span>

                  {index + 1}
                </td>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.purchased}</td>
                <td className="border p-2">{product.sellingPrice}</td>
                <td className="border p-2">{product.stock}</td>
                <td className="border p-2">
                  <span
                    className={`px-2 py-1 rounded-lg ${
                      product.stock > 5
                        ? "bg-green-200 text-green-800"
                        : product.stock > 0
                        ? "bg-blue-200 text-blue-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {product.stock > 5
                      ? "In Stock"
                      : product.stock > 0
                      ? "Re-purchase"
                      : "Out of Stock"}
                  </span>
                </td>
                <td className="border p-2 text-indigo-600 cursor-pointer">
                  Set
                </td>
              </tr>
            ) : null
          )}

          {/* Extra Rows for Adding More */}
          {[...Array(extraRows)].map((_, i) => (
            <tr key={data.length + i + 1} className="border bg-gray-50">
              <td className="border p-2">{data.length + i + 1}</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
