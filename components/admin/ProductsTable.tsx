"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product, Category } from "@/lib/types";
import { ProductForm } from "./ProductForm";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { ProductTableRow } from "./ProductTableRow";

interface ProductsTableProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ProductsTable({
  initialProducts,
  categories,
}: ProductsTableProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const handleAddClick = () => {
    setSelectedProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedProduct(undefined);
  };

  const handleFormSuccess = () => {
    // Refresh the page to show updated products
    router.refresh();
  };

  const handleDeleteSuccess = () => {
    // Refresh the page to show updated products
    router.refresh();
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (products.length === 0) {
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
          <p className="text-[#CCCCCC] mb-6">No products yet</p>
          <button
            onClick={handleAddClick}
            className="inline-block px-4 py-2.5 rounded-lg bg-[#E84A2F] text-white font-semibold hover:bg-[#D63A1F] transition-colors"
          >
            Create First Product
          </button>
        </div>

        {/* Modals - IMPORTANT: Must render even when no products */}
        <ProductForm
          product={selectedProduct}
          categories={categories}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />

        <DeleteConfirmDialog
          productId={productToDelete?.id || ""}
          productName={productToDelete?.name || ""}
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setProductToDelete(null);
          }}
          onSuccess={handleDeleteSuccess}
        />
      </>
    );
  }

  return (
    <>
      {/* Header with Add Button */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Products</h2>
          <p className="text-sm text-[#999999] mt-1">
            {filteredProducts.length} of {products.length} products
          </p>
        </div>
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
          Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products by name or description..."
          className="w-full px-4 py-2.5 bg-[#252525] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#E84A2F] transition-colors"
        />
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="bg-[#252525] rounded-xl border border-[#333333] p-8 text-center">
          <p className="text-[#999999]">
            No products found matching &quot;{searchTerm}&quot;
          </p>
        </div>
      )}

      {/* Table */}
      {filteredProducts.length > 0 && (
        <div className="bg-[#252525] rounded-xl border border-[#333333] overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#333333] bg-[#1A1A1A]">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#999999] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#999999] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#999999] uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#999999] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-[#999999] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <ProductTableRow
                    key={product.id}
                    product={product}
                    categories={categories}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            <div className="space-y-4 p-6">
              {filteredProducts.map((product) => {
                const category = categories.find(
                  (c) => c.id === product.category_id
                );
                return (
                  <div
                    key={product.id}
                    className="bg-[#1A1A1A] rounded-lg p-4 border border-[#333333]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">
                          {product.name}
                        </h3>
                        <p className="text-sm text-[#999999]">
                          {category?.name || "Unknown Category"}
                        </p>
                      </div>
                      <div className="text-xs font-semibold text-[#E84A2F]">
                        ${product.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          product.is_available
                            ? "bg-green-600/20 text-green-400"
                            : "bg-red-600/20 text-red-400"
                        }`}
                      >
                        {product.is_available ? "Available" : "Unavailable"}
                      </span>
                      {product.is_featured && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-600/20 text-yellow-400">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-[#333333] text-white hover:bg-[#333333] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-red-600/30 text-red-400 hover:bg-red-600/10 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ProductForm
        product={selectedProduct}
        categories={categories}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />

      <DeleteConfirmDialog
        productId={productToDelete?.id || ""}
        productName={productToDelete?.name || ""}
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}
