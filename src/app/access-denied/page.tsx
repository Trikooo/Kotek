import Background from "@/components/store/home/section1/Background";
import StoreLayout from "../store/StoreLayout";

export default function AccessDeniedPage() {
  return (
    <StoreLayout>
      <div className="flex justify-center items-center h-[95vh] overflow-hidden">
        <Background heightPercentage={123} />
        <h2 className="text-2xl font-semibold mr-5 pr-5 py-2 border-r border-primary">
          403
        </h2>
        <h2 className="py-2">Access to resource has been denied</h2>
      </div>
    </StoreLayout>
  );
}
