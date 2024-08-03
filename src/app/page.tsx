import Footer from "@/components/store/home/footer/Footer";
import Background from "@/components/store/home/section1/Background";
import Main from "@/components/store/home/section1/Main";
import Section2 from "@/components/store/home/section2/Section2";
import Section3 from "@/components/store/home/section3/Section3";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Main />
      <Section2 />
      <Section3 />
      <Footer />
    </div>
  );
}
