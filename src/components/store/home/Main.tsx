"use client"

import { useState } from "react";
import Header from "@/components/store/home/Header";
import MobileMenu from "@/components/store/home/MobileMenu";
import Hero from "@/components/store/home/Hero";

const Main = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Header  setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <Hero />
    </>
  );
};

export default Main;
