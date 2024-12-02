import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

 const ErrorComponent: React.FC = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="mt-24 w-full flex flex-col gap-4 items-center justify-center text-red-500">
      <AlertCircle className="w-8 h-8" strokeWidth={1.5} />
      <p>An error has occurred, please try again</p>
      <Button variant="secondary" className="mt-4" onClick={handleReload}>
        Reload Page
      </Button>
    </div>
  );
};

export default ErrorComponent;
