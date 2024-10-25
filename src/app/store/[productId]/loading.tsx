import { Loader2 } from "lucide-react";
import StoreLayout from "../StoreLayout";

export default function loading() {
  return (
    <StoreLayout>
      <div className="w-full h-[100vh] flex justify-center items-center animate-spin">
        <Loader2 className="w-8 h-8" strokeWidth={1.5} />
      </div>
    </StoreLayout>
  );
}
