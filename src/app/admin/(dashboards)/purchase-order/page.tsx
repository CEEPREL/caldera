"use client";
import { useCart } from "@/ContextAPI/cartContext";
import { getallOrderStatus } from "@/app/actions/fetch";
import { acceptAllOrder } from "@/app/actions/post";
import {
  PurchaseOrder,
  ProductRequest,
} from "@/app/caldera/[storeId]/stock-management/page";
import AdminOrderDetailSlider from "@/components/admin/AdminOrderDetailSlider";
import PurchaseOrderTableAdmin from "@/components/admin/purchaseOrderTableAdmin";
import MenuComponent from "@/components/store/general_UI/SmallMenuComp";
import React, { useState, useEffect, useRef } from "react";

interface MenuItem {
  label: string;
  icon: string;
  actionType?: "link" | "button" | "div";
  href?: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Confirm Order",
    icon: "/icons/brief_case.svg",
    actionType: "button",
    href: "/admin/purchase-order/update-order",
  },
  {
    label: "View Order",
    icon: "/icons/stores.svg",
    actionType: "link",
    href: "/settings",
  },
  {
    label: "Remove Order",
    icon: "/icons/delete.svg",
    actionType: "button",
  },
];

function Page() {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [poData, setPoData] = useState<PurchaseOrder[]>([]);
  const [openDetail, setOpenDetail] = useState(false);
  const { cart, setCart, removeFromCart, addToCart } = useCart();

  const productOrders = cart.map(
    ({
      categoryId,
      orderId,
      userName,
      storeName,
      categoryName,
      productId,
      productName,
      quantity,
      price,
    }) => ({
      categoryId,
      categoryName,
      orderId,
      price,
      userName,
      storeName,
      productId,
      productName,
      requestQuantity: quantity,
    })
  );
  const handleAddAllToCart = () => {
    // Loop through the poData array to map items to the cart
    poData.forEach((item) => {
      const {
        poId,
        userName,
        storeName,
        productRequest, // This is an array
      } = item;

      // Loop through the productRequest array to access each product
      productRequest.forEach((product) => {
        const {
          productId,
          productName,
          categoryId,
          categoryName,
          unitPrice, // price of the product
          requestQuantity, // quantity for the product
        } = product;

        // Add the product to the cart
        addToCart({
          productId,
          productName,
          storeName,
          userName,
          orderId: poId,
          categoryId,
          categoryName,
          price: unitPrice || 0, // price is unitPrice in ProductRequest
          quantity: requestQuantity, // quantity is requestQuantity
        });
      });
    });

    // Open the cart once all items are added
    setOpenDetail(true);
  };

  // Fetch purchase order data
  useEffect(() => {
    const fetchPoData = async () => {
      setLoadingProducts(true);
      const result = await getallOrderStatus();
      if (!result.status) {
        console.error(result.error || "Unknown error");
      } else {
        setPoData(result.data);
      }
      setLoadingProducts(false);
    };

    fetchPoData();
  }, []);

  const handleSubmit = () => {};
  const handleDelete = () => {};

  const handleMenuItemClick = async (label: string, poId: string) => {
    // if (label === "Confirm Order") {
    //   const orderToConfirm = poData.find((order) => order.poId === poId);
    //   if (orderToConfirm) {
    //     const payload = prepareOrderPayload(orderToConfirm);
    //     console.log("hi", payload);
    //     const result = await acceptAllOrder(payload);
    //     if (result.status) {
    //       alert("Order confirmed successfully");
    //     } else {
    //       alert("Failed to confirm order");
    //     }
    //   } else {
    //     console.error("Order not found for poId:", poId);
    //   }
    // }
    handleAddAllToCart;
    setOpenDetail(true);
    setOpenDropdownId(null); // Close dropdown
  };

  const prepareOrderPayload = (order: PurchaseOrder) => {
    const productRequests = order.productRequest.map(
      (product: ProductRequest) => {
        const costPrice = product.costPrice ? product.costPrice : 0;
        const unitPrice = product.unitPrice ? product.unitPrice : 0;

        return {
          prId: product.prId,
          costPrice: costPrice,
          unitPrice: unitPrice,
          quantity: product.requestQuantity,
        };
      }
    );

    return {
      poId: order.poId,
      product: productRequests,
    };
  };

  const columns = [
    { key: "id", label: "#" },
    { key: "poId", label: "Order ID" },
    { key: "storeName", label: "Cadre" },
    { key: "requestDate", label: "Date" },
    { key: "productRequestCount", label: "No of Product" },
    { key: "status", label: "Status" },
    {
      key: "action",
      label: "Action",
      render: (row: any) => (
        <div className="relative">
          <button
            className="dropdown-toggle"
            onClick={() =>
              setOpenDropdownId(openDropdownId === row.poId ? null : row.poId)
            }
          >
            •••
          </button>
          {openDropdownId === row.poId ? (
            <div
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50"
              ref={(el) => {
                dropdownRefs.current[row.poId] = el;
              }}
            >
              <div className="flex flex-col gap-2 p-2">
                <MenuComponent
                  menuItems={menuItems}
                  onMenuItemClick={(label: string) =>
                    handleMenuItemClick(label, row.poId)
                  }
                  product={row}
                />
              </div>
            </div>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      <div className="flex flex-col">
        <h1 className="text-2xl font-medium">Purchase Order</h1>
        {loadingProducts ? (
          <p>Loading...</p>
        ) : (
          <PurchaseOrderTableAdmin columns={columns} data={poData} />
        )}
      </div>
      <AdminOrderDetailSlider
        mainOrder={productOrders}
        isOpen={openDetail}
        onClose={() => setOpenDetail(false)}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Page;
