// components/ui/toast.tsx
import { Card } from "@/components/ui/card";
import { CircleAlert, CheckCircle, Info } from "lucide-react"; // icons
import clsx from "clsx";
import { useEffect, useState } from "react";

type ToastProps = {
  type: "error" | "info" | "success";
  message: string;
};

const ToastIcons = {
  error: CircleAlert,
  info: Info,
  success: CheckCircle,
};

const ToastColors = {
  error: "bg-red-500 text-white",
  info: "bg-blue-500 text-white",
  success: "bg-green-500 text-white",
};

export const Toast: React.FC<ToastProps> = ({ type, message }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [render, setRender] = useState(true);
  const Icon = ToastIcons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Toast disappears after 3 seconds

    if (!isVisible) { // Check isVisible directly
      const renderTimer = setTimeout(() => {
        setRender(false);
      }, 1000);
      return () => clearTimeout(renderTimer); // Clean up renderTimer
    }

    return () => clearTimeout(timer); // Clean up on unmount
  }, [isVisible]); // Include isVisible as a dependency

  return (
    <>
     {render && ( <Card
        className={clsx(
          "fixed top-4 p-3 flex items-center justify-center shadow-lg transition-opacity duration-300 animate-slide-down cursor-pointer border-red-600", // Ensure transition is applied
          ToastColors[type],
          isVisible ? "opacity-100" : "opacity-0" // Control opacity based on visibility
        )}
        style={{ zIndex: 1000 }} // Ensure the toast appears on top of other elements
      >
        <Icon className="w-4 h-4 mr-2" strokeWidth={1.5} />
        {message}
      </Card>)}
    </>
  );
};
