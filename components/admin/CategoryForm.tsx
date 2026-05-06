"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryFormSchema, Category } from "@/lib/types";
import { createCategory, updateCategory } from "@/lib/actions/categories";
import { generateSlug } from "@/lib/slug-utils";

interface CategoryFormProps {
  category?: Category;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CategoryForm({
  category,
  isOpen,
  onClose,
  onSuccess,
}: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: category || {
      name: "",
      slug: "",
      description: "",
      image_url: "",
      display_order: 0,
    },
  });

  const nameValue = watch("name");

  // Reset form when category changes (switching between edit/create or different category)
  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        image_url: category.image_url || "",
        display_order: category.display_order,
      });
    } else {
      reset({
        name: "",
        slug: "",
        description: "",
        image_url: "",
        display_order: 0,
      });
    }
  }, [category, reset]);

  // Auto-generate slug when name changes (if creating new)
  const handleNameChange = (value: string) => {
    if (!category && value !== nameValue) {
      setValue("slug", generateSlug(value));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      let result;
      if (category) {
        result = await updateCategory(category.id, data);
      } else {
        result = await createCategory(data);
      }

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setSubmitError(result.error || "Failed to save category");
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-[#1A1A1A] border-b border-[#333333] px-8 py-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {category ? "Edit Category" : "Add Category"}
            </h2>
            <button
              onClick={onClose}
              className="text-[#999999] hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            {/* Error Message */}
            {submitError && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                <p className="text-sm text-red-400">{submitError}</p>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Name *
              </label>
              <input
                type="text"
                {...register("name", {
                  onChange: (e) => handleNameChange(e.target.value),
                })}
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#E84A2F] transition-colors"
                placeholder="e.g., Road Bikes"
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Slug *
              </label>
              <input
                type="text"
                {...register("slug")}
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#E84A2F] transition-colors"
                placeholder="e.g., road-bikes"
              />
              {errors.slug && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.slug.message}
                </p>
              )}
              <p className="text-xs text-[#999999] mt-1">
                Auto-generated from name
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Description
              </label>
              <textarea
                {...register("description")}
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#E84A2F] transition-colors resize-none"
                rows={3}
                placeholder="Optional description for this category"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Image URL
              </label>
              <input
                type="url"
                {...register("image_url")}
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#E84A2F] transition-colors"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-[#999999] mt-1">
                Paste the full URL to an image
              </p>
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Display Order
              </label>
              <input
                type="number"
                {...register("display_order", { valueAsNumber: true })}
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#E84A2F] transition-colors"
                placeholder="0"
              />
              <p className="text-xs text-[#999999] mt-1">
                Lower numbers appear first
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-[#333333] text-white font-semibold hover:bg-[#252525] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#E84A2F] text-white font-semibold hover:bg-[#D63A1F] disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Saving..." : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
