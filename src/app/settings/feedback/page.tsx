"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreateFeedback } from "@/hooks/feedback/useFeedback";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import SettingsLayout from "../SettingsLayout";
import { Frown, Loader2, Meh, Smile } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const feedbackSchema = z.object({
  sentiment: z.enum(["negative", "neutral", "positive"]),
  message: z.string().min(1, "Comment should at least be 1 character long."),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export default function FeedbackForm() {
  const { mutateAsync: createFeedback, isPending } = useCreateFeedback();

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      sentiment: "positive",
      message: "",
    },
  });
  const { data: session } = useSession();
  const userId = session?.user?.id;

  async function onSubmit(data: FeedbackFormValues) {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to submit feedback",
        variant: "destructive",
      });
      return;
    }

    try {
      await createFeedback({ ...data, userId });
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    }
  }

  return (
    <SettingsLayout>
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Feedback</h1>
            <p className="text-sm text-muted-foreground">
              Help us improve your experience
            </p>
          </div>
        </header>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="sentiment"
            render={({ field }) => (
              <FormItem className="space-y-3 mb-10">
                <FormLabel>How do you feel about this?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem
                          value="positive"
                          id="positive"
                          className="hidden"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="positive"
                        className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground transition-all duration-100 ${
                          field.value === "positive" ? "border-indigo-600" : ""
                        }`}
                      >
                        <Smile className="mb-2 h-6 w-6" strokeWidth={1.5} />
                        Positive
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem
                          value="neutral"
                          id="neutral"
                          className="hidden"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="neutral"
                        className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground transition-all duration-100  ${
                          field.value === "neutral" ? "border-indigo-600" : ""
                        }`}
                      >
                        <Meh className="mb-2 h-6 w-6" strokeWidth={1.5} />
                        Neutral
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem
                          value="negative"
                          id="negative"
                          className="hidden"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="negative"
                        className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground transition-all duration-100 ${
                          field.value === "negative" ? "border-indigo-600" : ""
                        }`}
                      >
                        <Frown className="mb-2 h-6 w-6" strokeWidth={1.5} />
                        Negative
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Comments</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {!isPending ? (
              "Submit Feedback"
            ) : (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin animate-ping" />{" "}
                Loading...
              </>
            )}
          </Button>
        </form>
      </Form>
    </SettingsLayout>
  );
}
