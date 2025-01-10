import Main from "@/components/store/home/section1/Main";
import Section2 from "@/components/store/home/section2/Section2";
import Section3 from "@/components/store/home/section3/Section3";
import StoreLayout from "./store/StoreLayout";
import Testimonials from "@/components/store/home/testimonials/Testimonials";
const testimonialData = [
  {
    quote:
      "I highly recommend them, they are very professional, I am satisfied with their service and value for money.",
    name: "Yousra Medjeroub",
    image: "/testimonials/yousra.png",
  },
  {
    quote:
      "Very satisfactory service, excellent quality, price and availability",
    name: "abdel B",
    image: "/images/sarah-miller.jpg",
  },
  {
    quote:
      "I had a problem with one of their items, after checking it they did not hesitate to refund me. That said, I took another model and everything works as expected. I recommend.",
    name: "Kamel Hadjeb",
    image: "/testimonials/kamel.png",
  },

  // Add more testimonials as needed
];
export default function Home() {
  return (
    <div className="overflow-hidden">
      <StoreLayout>
        <Main />
        <div className=" mx-2 md:mx-0">
          <Section2 />
          <Section3 />
          <Testimonials testimonials={testimonialData} />
        </div>
      </StoreLayout>
    </div>
  );
}
