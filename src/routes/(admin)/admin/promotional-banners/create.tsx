// @ts-nocheck
// @ts-ignore
// @ts-expect-error

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createFileRoute } from "@tanstack/react-router";
import AdminViewHeader from "@/components/layouts/admin/header";
import { db } from "@/lib/db";
import { id } from "@instantdb/react";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  buttonText: z.string().min(1, "Button text is required"),
  link: z.string().url("Must be a valid URL (e.g., https://example.com)"),
  image: z
    .string()
    .min(1, "Image URL or data URL is required")
    .refine(
      (val) => val.startsWith("http") || val.startsWith("data:image"),
      "Image must be a valid URL or base64 data URL"
    ),
  order: z.coerce
    .number()
    .int("Order must be an integer")
    .min(0, "Order must be 0 or greater"),
  active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;



export const Route = createFileRoute(
  '/(admin)/admin/promotional-banners/create',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
    getValues
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      buttonText: "Learn More",
      link: "",
      image: "",
      order: 0,
      active: true,
    },
  });

  const watchImage = watch("image");

  // Handle image file upload (converts to base64 data URL)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPEG, PNG, WebP, etc.)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setValue("image", base64String, { shouldValidate: true });
      setImagePreviewError(false);
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  // Clear image field
  const clearImage = () => {
    setValue("image", "", { shouldValidate: true });
    setImagePreviewError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      db.transact(
        db.tx.promotionalBanners[id()].update({})
      )

      toast.success("Banner created successfully!");
      reset(); // Reset form after successful submission
      setImagePreviewError(false);
    } catch (error) {
      console.error("Error creating banner:", error);
      toast.error("Failed to create banner. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <AdminViewHeader />
      <div className="p-2 md:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Banner</h1>
          <p className="text-muted-foreground mt-2">
            Add a promotional banner to be displayed on your website. Fill in the
            details below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Banner Details</CardTitle>
                <CardDescription>
                  Enter the banner information. All fields are required unless
                  marked optional.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Title Field */}
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Title
                    </label>
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Summer Sale 2024"
                          disabled={isSubmitting}
                          className="mt-2"
                        />
                      )}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      The main heading of the banner.
                    </p>
                    {errors.title && (
                      <p className="text-sm font-medium text-destructive mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Subtitle Field */}
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Subtitle
                    </label>
                    <Controller
                      name="subtitle"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Get up to 50% off on selected items"
                          disabled={isSubmitting}
                          className="mt-2"
                        />
                      )}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      A supporting line below the title.
                    </p>
                    {errors.subtitle && (
                      <p className="text-sm font-medium text-destructive mt-1">
                        {errors.subtitle.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Button Text Field */}
                    <div>
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Button Text
                      </label>
                      <Controller
                        name="buttonText"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Shop Now"
                            disabled={isSubmitting}
                            className="mt-2"
                          />
                        )}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Text displayed on the call-to-action button.
                      </p>
                      {errors.buttonText && (
                        <p className="text-sm font-medium text-destructive mt-1">
                          {errors.buttonText.message}
                        </p>
                      )}
                    </div>

                    {/* Link URL Field */}
                    <div>
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Link URL
                      </label>
                      <Controller
                        name="link"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="https://example.com/sale"
                            disabled={isSubmitting}
                            className="mt-2"
                          />
                        )}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Where the banner button should redirect.
                      </p>
                      {errors.link && (
                        <p className="text-sm font-medium text-destructive mt-1">
                          {errors.link.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Image Field with Upload */}
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Banner Image
                    </label>
                    <div className="space-y-3 mt-2">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Controller
                          name="image"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="https://example.com/image.jpg or upload file"
                              disabled={isSubmitting}
                              className="flex-1"
                            />
                          )}
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isSubmitting}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                          {watchImage && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={clearImage}
                              disabled={isSubmitting}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isSubmitting}
                      />
                      <p className="text-sm text-muted-foreground">
                        Enter an image URL or upload an image (max 5MB). Supported
                        formats: JPEG, PNG, WebP.
                      </p>
                      {errors.image && (
                        <p className="text-sm font-medium text-destructive">
                          {errors.image.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Field */}
                    <div>
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Display Order
                      </label>
                      <Controller
                        name="order"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="1"
                            min="0"
                            placeholder="0"
                            {...field}
                            disabled={isSubmitting}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? ""
                                  : parseInt(e.target.value, 10)
                              )
                            }
                            className="mt-2"
                          />
                        )}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Lower numbers appear first. Use 0, 1, 2, etc.
                      </p>
                      {errors.order && (
                        <p className="text-sm font-medium text-destructive mt-1">
                          {errors.order.message}
                        </p>
                      )}
                    </div>

                    {/* Active Checkbox Field */}
                    <div>
                      <Controller
                        name="active"
                        control={control}
                        render={({ field }) => (
                          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isSubmitting}
                            />
                            <div className="space-y-1 leading-none">
                              <label className="text-sm font-medium leading-none">
                                Active
                              </label>
                              <p className="text-sm text-muted-foreground">
                                Inactive banners will not be displayed.
                              </p>
                            </div>
                          </div>
                        )}
                      />
                      {errors.active && (
                        <p className="text-sm font-medium text-destructive mt-1">
                          {errors.active.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => reset()}
                      disabled={isSubmitting}
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Create Banner
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  See how your banner will appear
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative rounded-lg overflow-hidden border bg-card shadow-sm">
                  {/* Banner Image */}
                  <div className="relative aspect-[16/9] bg-muted">
                    {watchImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={watchImage}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                        onError={() => setImagePreviewError(true)}
                        onLoad={() => setImagePreviewError(false)}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                        <ImageIcon className="h-12 w-12 opacity-30" />
                      </div>
                    )}
                    {imagePreviewError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted/80 backdrop-blur-sm">
                        <p className="text-sm text-destructive text-center px-2">
                          Image failed to load
                          <br />
                          <span className="text-xs">
                            Check URL or try uploading
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Banner Content Overlay (simulated) */}
                  <div className="p-4 bg-card">
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {watch("title") || "Banner Title"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {watch("subtitle") || "Banner subtitle appears here"}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <Button
                        size="sm"
                        className="pointer-events-none"
                        disabled={!watch("buttonText")}
                      >
                        {watch("buttonText") || "Button"}
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        Order: {watch("order")}
                      </span>
                    </div>
                  </div>

                  {/* Active Status Badge */}
                  <div className="absolute top-2 right-2">
                    <div
                      className={`px-2 py-1 rounded-md text-xs font-medium ${watch("active")
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                    >
                      {watch("active") ? "Active" : "Inactive"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-muted-foreground space-y-1">
                  <p className="font-medium">Preview Notes:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Banner image: 16:9 aspect ratio recommended</li>
                    <li>Title: Keep under 60 characters</li>
                    <li>Subtitle: Keep under 120 characters</li>
                    <li>Button text: 2-3 words for best results</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
                Actual banner styling may vary based on theme implementation
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

    </main>
  );
}
