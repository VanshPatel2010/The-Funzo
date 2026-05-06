"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Category } from "@/lib/types";

interface CategoryTableRowProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTableRow({
  category,
  onEdit,
  onDelete,
}: CategoryTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-[#333333] hover:bg-[#2A2A2A] transition-colors ${
        isDragging ? "bg-[#E84A2F]/10" : ""
      }`}
    >
      {/* Drag Handle */}
      <td className="px-6 py-4">
        <button
          {...attributes}
          {...listeners}
          className="text-[#666666] hover:text-[#999999] cursor-grab active:cursor-grabbing p-2 -m-2"
          title="Drag to reorder"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 11-4 0 2 2 0 014 0zM7 6a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0zM15 2a2 2 0 11-4 0 2 2 0 014 0zM15 6a2 2 0 11-4 0 2 2 0 014 0zM15 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
      </td>

      {/* Name */}
      <td className="px-6 py-4">
        <div className="font-medium text-white">{category.name}</div>
        {category.description && (
          <div className="text-sm text-[#999999] truncate">
            {category.description}
          </div>
        )}
      </td>

      {/* Slug */}
      <td className="px-6 py-4">
        <code className="text-sm text-[#E84A2F] bg-[#1A1A1A] px-2 py-1 rounded">
          {category.slug}
        </code>
      </td>

      {/* Display Order */}
      <td className="px-6 py-4">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#333333] text-sm font-semibold text-white">
          {category.display_order}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(category)}
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
            onClick={() => onDelete(category)}
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
