export default function HeroText() {
  return(
    <div className="flex-1 max-w-2xl">
<div className="text-center lg:text-left">
  <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
    Gear Up, And Rush B!
  </h1>
  <p className="mt-6 text-lg leading-8 text-gray-600">
    Explore a wide range of top-notch computers, accessories, and
    components tailored to meet all your tech needs. Whether you&apos;re a
    gamer, a professional, or a casual user, find the perfect setup to
    elevate your digital experience. Shop now and stay ahead with
    cutting-edge technology at unbeatable prices.
  </p>
  <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
    <a
      href="#"
      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Browse Store
    </a>
    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
      View Featured <span aria-hidden="true">→</span>
    </a>
  </div>
</div>
</div>
  )
};
