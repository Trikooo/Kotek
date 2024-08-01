export default function HeroText() {
  return (
    <div className="flex-1 max-w-2xl">
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
          Try Out Pc Builder!
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Build your dream PC with confidence using our interactive PC Builder
          tool. Select compatible components step-by-step, from CPUs to RAM,
          with our smart system ensuring all parts work seamlessly together.
          Perfect for both novices and enthusiasts, this tool takes the
          guesswork out of creating your ideal custom build.
        </p>
        <div className="mt-10 pl-1 flex items-center justify-center lg:justify-start gap-x-6">
          <a
            href="#"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Explore
          </a>
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            View Store <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
