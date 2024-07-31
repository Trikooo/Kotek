"use client";

import { useState } from "react";
import Header from "@/components/store/home/section1/Header";
import MobileMenu from "@/components/store/home/section1/MobileMenu";
import Hero from "@/components/store/home/section1/Hero";
import Background from "./Background";

const Main = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Background />
      <Header setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <Hero />
    </>
  );
};

export default Main;
