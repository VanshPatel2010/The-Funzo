"use client";

import { Product, Category } from "@/lib/types";

interface ProductTableRowProps {
  product: Product;
  categories: Category[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTableRow({
  product,
  categories,
  onEdit,
  onDelete,
}: ProductTableRowProps) {
  const category = categories.find((c) => c.id === product.category_id);

  return (
    <tr className="border-b border-[#333333] hover:bg-[#2A2A2A] transition-colors">
      {/* Name */}
      <td className="px-6 py-4">
        <div className="font-medium text-white">{product.name}</div>
        {product.description && (
          <div className="text-sm text-[#999999] truncate max-w-xs">
            {product.description}
          </div>
        )}
      </td>

      {/* Category */}
      <td className="px-6 py-4">
        <span className="text-sm text-[#CCCCCC]">
          {category?.name || "Unknown"}
        </span>
      </td>

      {/* Price */}
      <td className="px-6 py-4">
        <span className="font-semibold text-[#E84A2F]">
          ${product.price.toFixed(2)}
        </span>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <div className="flex gap-2 flex-wrap">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              product.is_available
                ? "bg-green-600/20 text-green-400"
                : "bg-red-600/20 text-red-400"
            }`}
          >
            {product.is_available ? "Available" : "Unavailable"}
          </span>
          {product.is_featured && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-600/20 text-yellow-400">
              Featured
            </span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(product)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-[#333333] text-white hover:bg-[#333333] transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(product)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-red-600/30 text-red-400 hover:bg-red-600/10 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
