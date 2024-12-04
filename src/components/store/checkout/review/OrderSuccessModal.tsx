"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false });

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrderSuccessModal({ isOpen, onClose }: OrderSuccessModalProps) {
  const [windowDimension, setWindowDimension] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", updateWindowDimensions);
    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      playPopSound();
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [isOpen]);

  const playPopSound = () => {
    if (typeof window !== "undefined") {
      const audio = new Audio("/sounds/pop.mp3");
      audio
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    }
  };

  return (
    <>
      {showConfetti && typeof window !== "undefined" && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 9999 }}
        >
          <ReactConfetti
            width={windowDimension.width}
            height={windowDimension.height}
            recycle={false}
            numberOfPieces={400}
            tweenDuration={10000}
            onConfettiComplete={() => setShowConfetti(false)}
          />
        </div>
      )}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[550px] md:max-w-[600px] lg:max-w-[650px] p-0">
          <div className="flex flex-col items-center justify-center p-6 pt-8 pb-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-t-lg">
            <CheckCircle className="w-16 h-16 text-indigo-600 mb-4" strokeWidth={1.5}/>
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-center mb-2">
                Order Placed Successfully!
              </DialogTitle>
              <DialogDescription className="text-lg text-center max-w-md">
                Your order has been placed. We appreciate your business and will
                contact you shortly to confirm the details.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 bg-white rounded-b-lg">
            <h3 className="text-xl font-semibold mb-2">What's Next?</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Our team will review your order and give you a call as soon as possible.</li>
              <li>
                We'll ship your package and ensure a rapid delivery.
              </li>
            </ul>
            <DialogFooter>
              <Button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                Close and Return to Home
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
