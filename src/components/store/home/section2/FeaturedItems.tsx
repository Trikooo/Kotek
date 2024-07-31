import FeaturedItemCard from "./FeaturedItemCard";

export default function FeaturedItems() {
  return (
    <div className="flex flex-col justify-center items-center mt-24">
    <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
      Featured Items
    </h1>
    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10 px-5 w-full">
     <FeaturedItemCard />
     <FeaturedItemCard />
     <FeaturedItemCard />
     <FeaturedItemCard />
    </div>
    </div>
  );
}
