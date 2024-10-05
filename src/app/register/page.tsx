"use client";

import Background from "@/components/store/home/section1/Background";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FaDiscord, FaFacebook } from "react-icons/fa";
import Image from "next/image";
import GoogleIcon from "@/components/icons/Google";
import Footer from "@/components/store/home/footer/Footer";
export default function RegisterPage() {
  return (
    <div className="w-full h-[80vh]">
      <div className="flex lg:flex-1 items-center justify-between p-6 lg:px-8">
        <a href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">KOTEK</span>
          <Image
            alt="logo"
            src="/kotek.png"
            className="h-6 w-auto"
            width={200}
            height={100}
          />
        </a>
        <Link href="/login">
          <Button variant="outline">Log in </Button>
        </Link>
      </div>
      <Background heightPercentage={115} />
      <main className="w-full h-full flex flex-col justify-center items-center gap-8">
        <RegisterComponent />
      </main>
      <Footer />
    </div>
  );
}

''
export function RegisterComponent() {
  return (
    <>
      <h3 className="text-3xl font-bold">Create your account</h3>
      <div className="flex flex-col items-center justify-center gap-3 w-80">
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 text-lg p-6 w-full "
        >
          <GoogleIcon className="w-5 h-5" /> Continue with Google
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2  text-lg p-6 w-full"
        >
          <FaFacebook className="w-5 h-5 text-facebookBlue" /> Continue with
          Facebook
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 text-lg p-6 w-full"
        >
          <FaDiscord className="w-5 h-5 text-discordBlue" /> Continue with
          Discord
        </Button>
      </div>
      <Link href={"#"} className="underline hover:text-indigo-600">
        Or continue with email -&gt;
      </Link>
    </>
  );
}
