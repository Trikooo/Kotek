"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaDiscord, FaFacebook } from "react-icons/fa";
import Background from "@/components/store/home/section1/Background";
import Footer from "@/components/store/home/footer/Footer";
import GoogleIcon from "@/components/icons/Google";
import { LoaderCircle } from "lucide-react";
import { Toast } from "@/components/ui/myToast";

export default function LoginPage() {
  const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Session data:", session);
    console.log("Session status:", status);

    const create = searchParams.get("create");
    setIsCreatingAccount(create === "true");
  }, [searchParams, session, status]);

  const toggleAccountCreation = () => {
    const newIsCreatingAccount = !isCreatingAccount;
    setIsCreatingAccount(newIsCreatingAccount);
    router.push(`/login${newIsCreatingAccount ? "?create=true" : ""}`);
  };

  return (
    <Suspense>
      <div className="w-full h-[80vh]">
        <Background heightPercentage={109} />
        <div className="flex lg:flex-1 items-center justify-between p-6 lg:px-8">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Kotek</span>
            <Image
              alt="logo"
              src="/kotek.png"
              className="h-6 w-auto"
              width={200}
              height={100}
            />
          </Link>
          <Button onClick={toggleAccountCreation} variant="outline">
            {isCreatingAccount ? "Log in" : "Sign up"}
          </Button>
        </div>

        <main className="w-full h-full flex flex-col justify-center items-center gap-8">
          <h3 className="text-3xl font-bold">
            {isCreatingAccount
              ? "Create your account"
              : "Log in to your account"}
          </h3>

          <LoginComponent status={status} />
        </main>
        <Footer />
      </div>
    </Suspense>
  );
}

type LoginComponentProps = {
  status: "loading" | "authenticated" | "unauthenticated";
};

function LoginComponent({ status }: LoginComponentProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(true);
      router.replace("/login");
    }
  }, [searchParams, router]);

  const handleSignIn = async (provider: string) => {
    setLoadingProvider(provider);
    try {
      await signIn(provider);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <>
      {error && (
        <Toast
          type={"error"}
          message={"Please try again or use a different provider"}
        />
      )}
      <div className="flex flex-col items-center justify-center gap-3 w-80">
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 text-lg p-7 w-full"
          onClick={() => handleSignIn("google")}
          disabled={loadingProvider === "google" || status === "loading"}
        >
          {loadingProvider === "google" || status === "loading" ? (
            <LoaderCircle className="w-5 h-5 animate-spin" />
          ) : (
            <GoogleIcon className="w-5 h-5" />
          )}
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 text-lg p-7 w-full"
          onClick={() => handleSignIn("facebook")}
          disabled={loadingProvider === "facebook" || status === "loading"}
        >
          {loadingProvider === "facebook" || status === "loading" ? (
            <LoaderCircle className="w-5 h-5 animate-spin" />
          ) : (
            <FaFacebook className="w-5 h-5 text-facebookBlue" />
          )}
          Continue with Facebook
        </Button>

        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 text-lg p-7 w-full"
          onClick={() => handleSignIn("discord")}
          disabled={loadingProvider === "discord" || status === "loading"}
        >
          {loadingProvider === "discord" || status === "loading" ? (
            <LoaderCircle className="w-5 h-5 animate-spin" />
          ) : (
            <FaDiscord className="w-5 h-5 text-discordBlue" />
          )}
          Continue with Discord
        </Button>
      </div>
      <Link href={"#"} className="underline hover:text-indigo-600">
        Or continue with email -&gt;
      </Link>
    </>
  );
}
