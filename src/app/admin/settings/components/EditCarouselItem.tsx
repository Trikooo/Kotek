"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useUpdateCarouselItem } from "@/hooks/carousel/useCarousel";
import { toast } from "@/hooks/use-toast";
import { CarouselItem } from "@prisma/client";
import {
  UpdateCarouselItemFormValues,
  updateCarouselItemSchema,
} from "@/validationSchemas/carouselItemSchema";
import { Progress } from "@/components/ui/progress";

interface EditCarouselItemProps {
  item: CarouselItem;
}

export default function EditCarouselItem({ item }: EditCarouselItemProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    item.imageUrl
  );
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { mutateAsync } = useUpdateCarouselItem();

  const form = useForm<UpdateCarouselItemFormValues>({
    resolver: zodResolver(updateCarouselItemSchema),
    defaultValues: {
      title: item.title,
      link: item.link,
      enabled: item.isActive ?? true,
    },
  });

  useEffect(() => {
    form.reset({
      title: item.title,
      link: item.link,
      enabled: item.isActive ?? true,
    });
    setImagePreview(item.imageUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const onSubmit = async (data: UpdateCarouselItemFormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("link", data.link);
      formData.append("isActive", data.enabled.toString());
      formData.append("imageUrl", item.imageUrl);
      formData.append("displayIndex", item.displayIndex.toString());
      if (data.imageFile && data.imageFile.length > 0) {
        formData.append("image", data.imageFile[0]);
      }
      await mutateAsync({ id: item.id, formData: formData });
      setIsOpen(false);
      form.reset();
      setUploadProgress(0);
      toast({
        title: "Carousel item updated successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred while updating carousel item",
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
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
          <SquarePen className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Carousel Item</DialogTitle>
          <DialogDescription>
            Update the details of your carousel item.
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
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enabled</FormLabel>
                    <FormDescription>
                      Toggle to enable or disable this carousel item
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                  "Update Carousel Item"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
