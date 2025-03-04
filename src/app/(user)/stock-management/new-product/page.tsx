"use client";
import Dropdown from "@/components/Dropdown";
import Image from "next/image";
import React, { useState } from "react";
import states from "@/data/states.json";
import { createProduct } from "@/app/actions/create";
import { useStore } from "@/ContextAPI/storeContex";

interface newProductProps {
  categoryName?: string;
  customCategory?: string;
  product: { productName: string }[];
}

function New() {
  const { products } = useStore();
  const categories = [...states.states.map((s) => s.name), "Add New"];

  // State for form data
  const [formData, setFormData] = useState<newProductProps>({
    categoryName: "",
    customCategory: "",
    product: [{ productName: "" }],
  });

  // Handle input changes
  const handleChange = (index: number, value: string) => {
    const updatedProducts = [...formData.product];
    updatedProducts[index] = { productName: value };
    setFormData({ ...formData, product: updatedProducts });
  };

  // Handle adding new product field
  const addProductField = () => {
    setFormData({
      ...formData,
      product: [...formData.product, { productName: "" }],
    });
  };
  const rmvProductField = () => {
    if (formData.product.length > 1) {
      setFormData({
        ...formData,
        product: formData.product.slice(0, -1),
      });
    }
  };

  // Handle category selection
  const handleStateSelect = (category: string) => {
    setFormData({
      ...formData,
      categoryName: category === "Add New" ? "" : category,
      customCategory: category === "Add New" ? "" : "",
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Select the correct category
    const selectedCategory = formData.categoryName || formData.customCategory;

    if (!selectedCategory) {
      alert("Please select or enter a category.");
      return;
    }

    try {
      const result = await createProduct({
        ...formData,
        categoryName: selectedCategory,
      });

      console.log("Store Created:", result);
      if (result.message) {
        setFormData({
          categoryName: "",
          customCategory: "",
          product: [{ productName: "" }],
        });
      }
    } catch (error) {
      console.error("Error creating store:", error);
    }
  };

  return (
    <div className="w-full h-[88%] bg-white overflow-y-scroll rounded-3xl">
      <button
        onClick={() => window.history.back()}
        className="flex sticky top-0 items-center flex-row"
      >
        <div className="flex justify-center items-center w-8 h-8 m-4 rounded-full bg-gray-300">
          <Image
            width={20}
            height={20}
            alt="No Data"
            src={"/icons/arrow_left.svg"}
          />
        </div>
        <h1 className="text-black">Back</h1>
      </button>

      <div className="w-full p-5 relative flex text-black">
        <form
          className="flex w-full items-center justify-center flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div
            onClick={() => console.log(products)}
            className="flex flex-col bg-gray-100 p-5 w-1/2 lg:w-1/3 gap-4"
          >
            <h1 className="text-lg font-bold">Create New Products</h1>
            <label htmlFor="store-state">Categories</label>
            <Dropdown
              className="gap-0 "
              className2="bg-white border-none w-full h-9 flex justify-between items-center rounded-md"
              label={formData.categoryName || "Select a Category"}
              options={categories}
              onSelect={handleStateSelect}
              getLabel={(category) => category}
              getSubLabel={() => ""}
              id="store-state"
              placeholder="Select existing category"
            />
            {formData.categoryName === "" && (
              <input
                type="text"
                id="customCategory"
                placeholder="Enter new category"
                value={formData.customCategory}
                onChange={(e) =>
                  setFormData({ ...formData, customCategory: e.target.value })
                }
                className="h-8 p-1 rounded-md"
              />
            )}
          </div>

          <div className="flex flex-col bg-gray-100 p-5 w-1/2 lg:w-1/3 gap-4">
            <label>Products</label>
            {formData.product.map((p, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  className="h-8 p-1 rounded-md w-full"
                  type="text"
                  placeholder={`Product ${index + 1}`}
                  value={p.productName}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              </div>
            ))}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={rmvProductField}
                className="text-button text-right"
              >
                Remove -
              </button>
              <button
                type="button"
                onClick={addProductField}
                className="text-button text-right"
              >
                Add +
              </button>
            </div>
            <button
              type="submit"
              className="bg-button mt-2 text-white p-2 rounded-full"
            >
              Send Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default New;
