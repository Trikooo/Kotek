import React from "react";
import StoreLayout from "../store/StoreLayout";
import Link from "next/link";
import { FaFacebook, FaTiktok, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Ouedkniss from "@/components/icons/Ouedkniss";


export default function LinksPage() {
  return (
    <StoreLayout>
      <div className="flex flex-col items-center justify-center h-[60vh]">

        <div className="max-w-md w-full space-y-6 px-4 mt-10">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Connect with us</h1>
            <p className="text-muted-foreground">
              Follow us on social media for incredible content.
            </p>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <Link href="https://www.instagram.com/kotek.informatique/" className="group" prefetch={false}>
              <div className="aspect-square bg-muted rounded-full flex items-center justify-center text-muted-foreground transition-transform transform group-hover:scale-105">
                <FaInstagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </div>
            </Link>
            <Link href="https://www.tiktok.com/@kotek.informatique" className="group" prefetch={false}>
              <div className="aspect-square bg-muted rounded-full flex items-center justify-center text-muted-foreground transition-transform transform group-hover:scale-105 duration-200">
                <FaTiktok className="h-6 w-6" />
                <span className="sr-only">TikTok</span>
              </div>
            </Link>
            <Link href="https://www.facebook.com/profile.php?id=100089458340168&paipv=0&eav=AfavK7MpqtSWeXd4hUZ4BGHTHhyVb9e2iR36uCKcDDKKEJTxfRzNIemtdS93OuL67WU" className="group" prefetch={false}>
              <div className="aspect-square bg-muted rounded-full flex items-center justify-center text-muted-foreground transition-transform transform group-hover:scale-105">
                <FaFacebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </div>
            </Link>
            <Link href="tel:+213659865119" className="group" prefetch={false}>
              <div className="aspect-square bg-muted rounded-full flex items-center justify-center text-muted-foreground transition-transform transform group-hover:scale-105">
                <FaWhatsapp className="h-6 w-6" />
                <span className="sr-only">WhatsApp</span>
              </div>
            </Link>
            <Link href="https://www.ouedkniss.com/store/26245/kotek-informatique/accueil" className="group" prefetch={false}>
              <div className="aspect-square bg-muted rounded-full flex items-center justify-center text-muted-foreground transition-transform transform group-hover:scale-105">
                <Ouedkniss className="h-6 w-6" />
                <span className="sr-only">Ouedkniss</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
