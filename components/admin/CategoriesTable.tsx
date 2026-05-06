"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/lib/types";
import { CategoryForm } from "./CategoryForm";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CategoryTableRow } from "./CategoryTableRow";
import { reorderCategories } from "@/lib/actions/categories";

interface CategoriesTableProps {
  initialCategories: Category[];
}

export function CategoriesTable({ initialCategories }: CategoriesTableProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [isReordering, setIsReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddClick = () => {
    setSelectedCategory(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedCategory(undefined);
  };

  const handleFormSuccess = () => {
    // Refresh the page to show updated categories
    router.refresh();
  };

  const handleDeleteSuccess = () => {
    // Refresh the page to show updated categories
    router.refresh();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Update local state immediately for optimistic UI
        const newCategories = arrayMove(categories, oldIndex, newIndex);
        setCategories(newCategories);

        // Call server action to persist changes
        setIsReordering(true);
        try {
          const updates = newCategories.map((cat, idx) => ({
            id: cat.id,
            display_order: idx,
          }));

          const result = await reorderCategories(updates);
          if (!result.success) {
            // Revert on error
            setCategories(categories);
            console.error("Failed to reorder categories:", result.error);
          }
        } catch (error) {
          // Revert on error
          setCategories(categories);
          console.error("Error during drag-drop reorder:", error);
        } finally {
          setIsReordering(false);
        }
      }
    }
  };

  if (categories.length === 0) {
    return (
      <>
        <div className="bg-[#252525] rounded-xl border border-[#333333] p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#333333] mb-4">
            <svg
              className="w-8 h-8 text-[#999999]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-[#CCCCCC] mb-6">No categories yet</p>
          <button
            onClick={handleAddClick}
            className="inline-block px-4 py-2.5 rounded-lg bg-[#E84A2F] text-white font-semibold hover:bg-[#D63A1F] transition-colors"
          >
            Create First Category
          </button>
        </div>

        {/* Modals */}
        <CategoryForm
          category={selectedCategory}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />

        <DeleteConfirmDialog
          categoryId={categoryToDelete?.id || ""}
          categoryName={categoryToDelete?.name || ""}
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
          }}
          onSuccess={handleDeleteSuccess}
        />
      </>
    );
  }

  return (
    <>
      {/* Header with Add Button */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Categories</h2>
        <button
          onClick={handleAddClick}
          className="px-4 py-2.5 rounded-lg bg-[#E84A2F] text-white font-semibold hover:bg-[#D63A1F] inline-flex items-center gap-2 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Category
        </button>
      </div>

      {/* Reordering Indicator */}
      {isReordering && (
        <div className="mb-4 bg-blue-500/10 border border-blue-500 rounded-lg p-3">
          <p className="text-sm text-blue-400">Reordering categories...</p>
        </div>
      )}

      {/* Table */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="bg-[#252525] rounded-xl border border-[#333333] overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#333333] bg-[#1A1A1A]">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#999999] uppercase tracking-wider">
                    ⋮
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#999999] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#999999] uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#999999] uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-[#999999] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <SortableContext
                  items={categories.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {categories.map((category) => (
                    <CategoryTableRow
                      key={category.id}
                      category={category}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            <SortableContext
              items={categories.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4 p-6">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-[#1A1A1A] rounded-lg p-4 border border-[#333333]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">
                          {category.name}
                        </h3>
                        <p className="text-sm text-[#999999]">
                          {category.slug}
                        </p>
                      </div>
                      <div className="text-xs font-semibold text-[#E84A2F]">
                        #{category.display_order}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(category)}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-[#333333] text-white hover:bg-[#333333] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category)}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-red-600/30 text-red-400 hover:bg-red-600/10 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SortableContext>
          </div>
        </div>
      </DndContext>

      {/* Modals */}
      <CategoryForm
        category={selectedCategory}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />

      <DeleteConfirmDialog
        categoryId={categoryToDelete?.id || ""}
        categoryName={categoryToDelete?.name || ""}
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setCategoryToDelete(null);
        }}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}
