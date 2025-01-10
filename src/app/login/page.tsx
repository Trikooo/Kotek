"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaDiscord } from "react-icons/fa";
import Footer from "@/components/store/home/footer/Footer";
import GoogleIcon from "@/components/icons/Google";
import { AlertCircle, Loader2, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EmailLoginForm from "./EmailLoginForm";

export default function LoginPage() {
  const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // Redirect to home or dashboard
      router.refresh(); // Refresh the page to ensure new session state is reflected
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === "loading" || status === "authenticated") {
    return (
      <div className="w-full h-[100vh] flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin" strokeWidth={1.5} />
      </div>
    );
  }
  // Wrap the search params usage in a Suspense boundary
  return (
    <Suspense
      fallback={
        <div className="w-full h-[100vh] flex justify-center items-center animate-spin">
          <Loader2 className="w-8 h-8" strokeWidth={1.5} />
        </div>
      }
    >
      <SearchParamsHandler setIsCreatingAccount={setIsCreatingAccount} />
      <div className="w-full h-[80vh]">
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
          <Button
            onClick={() => setIsCreatingAccount((prev) => !prev)}
            variant="outline"
          >
            {isCreatingAccount ? "Log in" : "Sign up"}
          </Button>
        </div>

        <main className="w-full h-full flex flex-col justify-center items-center">
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

function SearchParamsHandler({
  setIsCreatingAccount,
}: {
  setIsCreatingAccount: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const create = searchParams.get("create");
    setIsCreatingAccount(create === "true");
  }, [searchParams, setIsCreatingAccount]);

  return null; // This component doesn't need to render anything
}

type LoginComponentProps = {
  status: "loading" | "authenticated" | "unauthenticated";
};

function LoginComponent({ status }: LoginComponentProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(true);
      router.replace("/login");
      toast({
        variant: "destructive",
        title: (
          <>
            <AlertCircle className="w-5 h-5" strokeWidth={1.5} />
            Uh oh, there was a problem
          </>
        ),
        description: "Please try again or use a different provider",
      });
    }
  }, [searchParams, router, toast]);

  const handleSignIn = async (provider: string) => {
    setLoadingProvider(provider);
    try {
      await signIn(provider);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="relative w-96 h-72 overflow-hidden">
      {/* Providers */}
      <div
        className={`absolute w-full h-full flex flex-col items-center justify-center transition-transform transform duration-500 ease-in-out gap-3 ${
          showEmailInput ? "-translate-x-[calc(100%+1.5rem)]" : "translate-x-0"
        }`}
      >
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

        <Button
          onClick={() => setShowEmailInput(true)}
          className=" hover:text-indigo-600"
          variant="link"
        >
          Or continue with email →
        </Button>
      </div>

      {/* Email Input */}
      <div
        className={`absolute w-full h-full flex flex-col items-center justify-center transition-transform transform duration-500 ease-in-out gap-3 p-5 ${
          showEmailInput ? "translate-x-0" : "translate-x-[calc(100%+1.5rem)]"
        }`}
      >
        <EmailLoginForm onBack={() => setShowEmailInput(false)} />
      </div>
    </div>
  );
}
