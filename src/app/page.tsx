import Footer from "@/components/store/home/footer/Footer";
import Background from "@/components/store/home/section1/Background";
import Main from "@/components/store/home/section1/Main";
import Section2 from "@/components/store/home/section2/Section2";
import Section3 from "@/components/store/home/section3/Section3";
import StoreLayout from "./store/StoreLayout";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <StoreLayout>
      <Main />
      <div className=" mx-2 md:mx-0">
      <Section2 />
      <Section3 />
      </div>

      </StoreLayout>
    </div>
  );
}
