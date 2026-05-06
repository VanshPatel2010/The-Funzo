"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productFormSchema,
  ProductFormData,
  Product,
  Category,
} from "@/lib/types";
import {
  createProduct as createProductAction,
  updateProduct as updateProductAction,
} from "@/lib/actions/products";
import { parseImages } from "@/lib/helpers";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductForm({
  product,
  categories,
  isOpen,
  onClose,
  onSuccess,
}: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [imageInput, setImageInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: product || {
      name: "",
      description: "",
      price: 0,
      category_id: "",
      images: [],
      tags: [],
      age_range: "",
      is_featured: false,
      is_available: true,
    },
  });

  const tags = watch("tags");
  const images = watch("images");

  // Reset form when product changes (switching between edit/create or different product)
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || "",
        price: product.price,
        category_id: product.category_id,
        images: parseImages(product.images),
        tags: product.tags || [],
        age_range: product.age_range || "",
        is_featured: product.is_featured,
        is_available: product.is_available,
      });
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        category_id: "",
        images: [],
        tags: [],
        age_range: "",
        is_featured: false,
        is_available: true,
      });
    }
  }, [product, reset]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue("tags", [...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setValue(
      "tags",
      tags.filter((t) => t !== tag)
    );
  };

  const handleAddImage = () => {
    if (images.length >= 4) {
      setSubmitError("You can add up to 4 product images");
      return;
    }

    if (imageInput.trim() && !images.includes(imageInput.trim())) {
      setValue("images", [...images, imageInput.trim()]);
      setImageInput("");
      setSubmitError(null);
    }
  };

  const handleRemoveImage = (image: string) => {
    setValue(
      "images",
      images.filter((img) => img !== image)
    );
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      let result;
      if (product) {
        result = await updateProductAction(product.id, data);
      } else {
        result = await createProductAction(data);
      }

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setSubmitError(result.error || "Failed to save product");
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
        <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-[#1A1A1A] border-b border-[#333333] px-8 py-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {product ? "Edit Product" : "Add Product"}
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
                {...register("name")}
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#E84A2F] transition-colors"
                placeholder="e.g., Mountain Bike Pro"
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 bg-[#252525] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#E84A2F] transition-colors"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Category *
                </label>
                <select
                  {...register("category_id")}
                  className="w-full px-4 py-2.5 bg-[#252525] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#E84A2F] transition-colors"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.category_id.message}
                  </p>
                )}
              </div>
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
                placeholder="Detailed product description"
              />
            </div>

            {/* Age Range */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Age Range
              </label>
              <input
                type="text"
                {...register("age_range")}
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#E84A2F] transition-colors"
                placeholder="e.g., 5-8 years"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Product Images
              </label>
              <p className="text-xs text-[#999999] mb-3">
                Add up to 4 image URLs. Customers can switch images on the
                product card and product page.
              </p>
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddImage();
                    }
                  }}
                  className="flex-1 px-4 py-2.5 bg-[#252525] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#E84A2F] transition-colors"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  disabled={images.length >= 4}
                  className="px-4 py-2.5 rounded-lg bg-[#E84A2F] text-white font-semibold hover:bg-[#D63A1F] transition-colors"
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-[#999999] mb-3">
                {images.length}/4 images added
              </p>
              {errors.images && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.images.message}
                </p>
              )}
              {images.length > 0 && (
                <div className="space-y-2">
                  {images.map((image, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-[#252525] border border-[#333333] rounded-lg p-3"
                    >
                      <span className="text-sm text-[#999999] truncate">
                        {image}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 px-4 py-2.5 bg-[#252525] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#E84A2F] transition-colors"
                  placeholder="e.g., outdoor, lightweight"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2.5 rounded-lg bg-[#E84A2F] text-white font-semibold hover:bg-[#D63A1F] transition-colors"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="inline-flex items-center gap-2 bg-[#E84A2F]/20 border border-[#E84A2F] rounded-full px-3 py-1"
                    >
                      <span className="text-sm text-[#E84A2F]">{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-[#E84A2F] hover:text-red-300 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("is_featured")}
                  className="w-4 h-4 rounded bg-[#252525] border border-[#333333] accent-[#E84A2F]"
                />
                <span className="text-sm text-white font-semibold">
                  Featured Product
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("is_available")}
                  className="w-4 h-4 rounded bg-[#252525] border border-[#333333] accent-[#E84A2F]"
                  defaultChecked
                />
                <span className="text-sm text-white font-semibold">
                  Available for Sale
                </span>
              </label>
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
                {isSubmitting ? "Saving..." : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
