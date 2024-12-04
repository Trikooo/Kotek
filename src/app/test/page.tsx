"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { OrderSuccessModal } from '@/components/store/checkout/review/OrderSuccessModal';


export default function OrderSuccessPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Order Success Modal Test Page</h1>
        <Button
          onClick={handleOpenModal}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Place Test Order
        </Button>
      </div>

      <OrderSuccessModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}