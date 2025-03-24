"use client";
import ProductTable from "@/components/store/general_UI/ProductTable";

export default function StorePage() {
  return (
    <div className="w-full h-[88%] bg-white overflow-y-scroll rounded-3xl ">
      <div className="w-full p-5 relative text-black  bg-white">
        <div className="flex w-full flex-row justify-between items-center">
          <h1 className="text-2xl font-bold">Stock Management</h1>
          <input
            className="w-1/4 h-10 rounded-2xl border border-gray-300 p-2"
            type="text"
            placeholder="Search here..."
          />
        </div>
        <div className="w-full pt-5 h-full">
          <ProductTable />
        </div>
      </div>
    </div>
  );
}

// const handleAddAllToCart = () => {
//   // Loop through the poData array to map items to the cart
//   poData.forEach((item) => {
//     const {
//       poId,
//       userName,
//       storeName,
//       productRequest, // This is an array
//     } = item;

//     // Loop through the productRequest array to access each product
//     productRequest.forEach((product) => {
//       const {
//         productId,
//         productName,
//         categoryId,
//         categoryName,
//         unitPrice, // price of the product
//         requestQuantity, // quantity for the product
//       } = product;

//       // Add the product to the cart
//       addToCart({
//         productId,
//         productName,
//         storeName,
//         userName,
//         orderId: poId,
//         categoryId,
//         categoryName,
//         price: unitPrice || 0, // price is unitPrice in ProductRequest
//         quantity: requestQuantity, // quantity is requestQuantity
//       });
//     });
//   });

//   // Open the cart once all items are added
//   setOpenDetail(true);
// };
