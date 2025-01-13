"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useCreateCarouselItem } from "@/hooks/carousel/useCarousel";
import { toast } from "@/hooks/use-toast";
import {
  CarouselItemFormValues,
  carouselItemSchema,
} from "@/validationSchemas/carouselItemSchema";
import { Progress } from "@/components/ui/progress";

export default function CreateCarouselItem() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { mutateAsync } = useCreateCarouselItem();

  const form = useForm<CarouselItemFormValues>({
    resolver: zodResolver(carouselItemSchema),
    defaultValues: {
      title: "",
      link: "",
    },
  });

  const onSubmit = async (data: CarouselItemFormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("link", data.link);
      formData.append("image", data.imageFile[0]);
      const newItem = await mutateAsync(formData);
      // Close the dialog after submission
      setIsOpen(false);
      // Reset the form
      form.reset();
      setImagePreview(null);
      setUploadProgress(0);
      toast({
        title: "Carousel item created successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred while creating carousel item",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsImageLoading(true);
      setUploadProgress(0);
      const reader = new FileReader();

      reader.onloadstart = () => {
        setIsImageLoading(true);
      };

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setIsImageLoading(false);
        setUploadProgress(100);
      };

      reader.onerror = () => {
        setIsImageLoading(false);
        setUploadProgress(0);
        toast({
          variant: "destructive",
          title: "Error loading image",
        });
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Carousel Item</DialogTitle>
          <DialogDescription>
            Create a new item for your carousel.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter carousel item title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https:/example/product/link.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageFile"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        onChange(e.target.files);
                        handleImageChange(e);
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isImageLoading && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
            {imagePreview && !isImageLoading && (
              <div className="mt-4">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full h-auto"
                  height={200}
                  width={200}
                />
              </div>
            )}
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {"Loading..."}
                  </div>
                ) : (
                  "Create Carousel Item"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
