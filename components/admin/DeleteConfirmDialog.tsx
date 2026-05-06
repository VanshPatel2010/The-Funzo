"use client";

import { useState } from "react";
import { deleteCategory } from "@/lib/actions/categories";
import { deleteProduct } from "@/lib/actions/products";

interface DeleteConfirmDialogProps {
  categoryId?: string;
  categoryName?: string;
  productId?: string;
  productName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteConfirmDialog({
  categoryId,
  categoryName,
  productId,
  productName,
  isOpen,
  onClose,
  onSuccess,
}: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCategory = !!categoryId;
  const isProduct = !!productId;
  const itemName = categoryName || productName || "item";
  const itemType = isCategory ? "Category" : isProduct ? "Product" : "item";

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      let result;
      if (isCategory && categoryId) {
        result = await deleteCategory(categoryId);
      } else if (isProduct && productId) {
        result = await deleteProduct(productId);
      } else {
        throw new Error("No valid ID provided");
      }

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || `Failed to delete ${itemType.toLowerCase()}`);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsDeleting(false);
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

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] shadow-xl max-w-sm w-full">
          {/* Header */}
          <div className="border-b border-[#333333] px-8 py-6">
            <h2 className="text-xl font-bold text-white">Delete {itemType}</h2>
          </div>

          {/* Content */}
          <div className="px-8 py-6 space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <p className="text-[#CCCCCC]">
              Are you sure you want to delete <strong>{itemName}</strong>?
            </p>

            <p className="text-xs text-[#999999]">
              {isCategory
                ? "This action cannot be undone. All products in this category will remain in the database."
                : "This action cannot be undone."}
            </p>
          </div>

          {/* Buttons */}
          <div className="border-t border-[#333333] px-8 py-6 flex gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 rounded-lg border border-[#333333] text-white font-semibold hover:bg-[#252525] disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
