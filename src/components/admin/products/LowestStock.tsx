"use client";

import { DataTable } from "@/components/dynamic-ui/DataTable";
import DynamicDropdownMenu from "@/components/dynamic-ui/DropDownMenu";

export default function LowestStock() {
  const columns = [
    { header: "Image", important: false },
    { header: "Name", important: true },
    { header: "Status", badge: true },
    { header: "Price", important: false },
    { header: "Stock", important: true },
    { header: "Created at", important: false },
    { header: "Actions", important: true },
  ];

  const rows = [
    {
      id: 1,
      image: "/profile-image.png",
      name: "Laser Lemonade Machine",
      status: { value: "Draft", filled: false },
      price: "$499.99",
      stock: 25,
      created_at: "2023-07-12 10:42 AM",
      actions: <ProductsDropDown />,
    },
    {
      id: 2,
      image: "/profile-image.png",
      name: "Hypernova Headphones",
      status: { value: "Active", filled: true },
      price: "$129.99",
      stock: 100,
      created_at: "2023-10-18 03:21 PM",
      actions: <ProductsDropDown />,
    },
    {
      id: 3,
      image: "/profile-image.png",
      name: "AeroGlow Desk Lamp",
      status: { value: "Active", filled: true },
      price: "$39.99",
      stock: 50,
      created_at: "2023-11-29 08:15 AM",
      actions: <ProductsDropDown />,
    },
    {
      id: 4,
      image: "/profile-image.png",
      name: "TechTonic Energy Drink",
      status: { value: "Draft", filled: false },
      price: "$2.99",
      stock: 0,
      created_at: "2023-12-25 11:59 PM",
      actions: <ProductsDropDown />,
    },
    {
      id: 5,
      image: "/profile-image.png",
      name: "Gamer Gear Pro Controller",
      status: { value: "Active", filled: true },
      price: "$59.99",
      stock: 75,
      created_at: "2024-01-01 12:00 AM",
      actions: <ProductsDropDown />,
    },
    {
      id: 6,
      image: "/profile-image.png",
      name: "Luminous VR Headset",
      status: { value: "Active", filled: true },
      price: "$199.99",
      stock: 30,
      created_at: "2024-02-14 02:14 PM",
      actions: <ProductsDropDown />,
    },
    {
      id: 7,
      image: "/profile-image.png",
      name: "Quantum Keyboard",
      status: { value: "Active", filled: true },
      price: "$89.99",
      stock: 150,
      created_at: "2024-03-03 09:30 AM",
      actions: <ProductsDropDown />,
    },
    {
      id: 8,
      image: "/profile-image.png",
      name: "Nebula Projector",
      status: { value: "Draft", filled: false },
      price: "$299.99",
      stock: 10,
      created_at: "2024-04-22 04:45 PM",
      actions: <ProductsDropDown />,
    },
    {
      id: 9,
      image: "/profile-image.png",
      name: "Celestial Smartwatch",
      status: { value: "Active", filled: true },
      price: "$149.99",
      stock: 60,
      created_at: "2024-05-10 12:00 PM",
      actions: <ProductsDropDown />,
    },
    {
      id: 10,
      image: "/profile-image.png",
      name: "Stellar Mouse Pad",
      status: { value: "Draft", filled: false },
      price: "$15.99",
      stock: 200,
      created_at: "2024-06-15 03:20 PM",
      actions: <ProductsDropDown />,
    },
    {
      id: 11,
      image: "/profile-image.png",
      name: "Aurora Desk Organizer",
      status: { value: "Active", filled: true },
      price: "$24.99",
      stock: 80,
      created_at: "2024-07-08 10:00 AM",
      actions: <ProductsDropDown />,
    },
    {
      id: 12,
      image: "/profile-image.png",
      name: "Lunar Mouse",
      status: { value: "Active", filled: true },
      price: "$59.99",
      stock: 40,
      created_at: "2024-08-22 11:30 AM",
      actions: <ProductsDropDown />,
    },
    {
      id: 13,
      image: "/profile-image.png",
      name: "Galactic Bluetooth Speaker",
      status: { value: "Draft", filled: false },
      price: "$89.99",
      stock: 15,
      created_at: "2024-09-19 05:00 PM",
      actions: <ProductsDropDown />,
    },
  ];

  return (
    <DataTable
      title="Lowest In Stock"
      description="Manage your products and view their sales performance."
      columns={columns}
      rows={rows}
      footer={
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      }
      currentPage={0}
      totalPages={0}
      setPage={() => {
              }}
    />
  );
}

function ProductsDropDown() {
  const menuItems = [
    { label: "Edit", onClick: () => console.log("Edit clicked") },
    { label: "Delete", onClick: () => console.log("Delete clicked") },
  ];

  return <DynamicDropdownMenu label="Actions" items={menuItems} isLoggedIn />;
}
