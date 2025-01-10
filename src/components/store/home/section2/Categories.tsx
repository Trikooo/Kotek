import CategoriesCarousel from "./CategoriesCarousel";

export default function Categories() {
  return (
    <section id="categories">
      <div className="flex flex-col justify-center items-center sm:pt-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
          Categories
        </h1>
        <div className="w-full py-12  sm:px-10">
          <CategoriesCarousel />
        </div>
      </div>
    </section>
  );
}
