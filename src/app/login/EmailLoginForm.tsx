import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Must be a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

const EmailLoginForm = ({ onBack }: { onBack: () => void }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
            setLoading(true);
      setError(null);

      const result = await signIn("email", {
        email: values.email,
        redirect: false,
      });

      if (result?.error) {
        console.error("Login error:", result.error);
        setError("Failed to send verification email. Please try again.");
      } else {
                setError("Check your email for the login link!");
        form.reset();
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
          }
  };

  return (
    <div className="w-full space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && (
            <p
              className={`text-sm ${
                error.includes("Check your email")
                  ? "text-indigo-600"
                  : "text-red-600"
              } text-center`}
            >
              {error}
            </p>
          )}
          <div className="space-y-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                "Continue with Email"
              )}
            </Button>
            <Button
              type="button"
              onClick={onBack}
              variant="link"
              className="w-full hover:text-indigo-600 transition-none"
              disabled={loading}
            >
              ← Go back
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EmailLoginForm;
