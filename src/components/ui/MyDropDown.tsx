import { useState } from "react";
import EditProduct from "../admin/products/EditProduct";
import { DeleteProduct } from "../admin/products/DeleteProduct";
import { Product } from "@prisma/client";

// Define the type for the props
interface MyDropDownProps {
  product: Product;
}

const MyDropDown: React.FC<MyDropDownProps> = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={toggleMenu}
          className="flex items-center p-2 text-gray-600 hover:text-gray-800"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="block w-1 h-1 bg-gray-600 rounded-full"></span>
            <span className="block w-1 h-1 bg-gray-600 rounded-full my-1"></span>
            <span className="block w-1 h-1 bg-gray-600 rounded-full"></span>
          </div>
        </button>
      </div>
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-1">
            <div
              onClick={closeMenu}
              className="group flex items-center p-2 text-sm cursor-pointer hover:bg-gray-100"
            >
              <EditProduct product={product} />
              <span className="ml-2">Edit</span>
            </div>
            <div
              onClick={closeMenu}
              className="group flex items-center p-2 text-sm cursor-pointer hover:bg-gray-100"
            >
              <DeleteProduct id={product.id} />
              <span className="ml-2">Delete</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDropDown;
