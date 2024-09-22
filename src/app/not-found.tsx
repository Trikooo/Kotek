import StoreLayout from "./store/StoreLayout";

export default function NotFound() {
  return (

      <div className="flex justify-center items-center h-[95vh]">
        <h2 className="text-2xl font-semibold mr-5 pr-5 py-2 border-r border-primary">
          404
        </h2>
        <h2 className="py-2">This page could not be found.</h2>
      </div>

  );
}
