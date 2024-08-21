import CategoriesCarousel from "./CategoriesCarousel";

export default function Categories() {
  return(
    <div className="flex flex-col justify-center items-center mt-24">
      <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">Categories</h1>
      <div className="my-24 w-3/4 sm:w-3/4 md:w-5/6 lg:w-11/12">
        <CategoriesCarousel />
      </div>
    </div>
  )
};
