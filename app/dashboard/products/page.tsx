"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Package,
  Trash2,
  Pencil,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  AlertCircle,
  Archive,
} from "lucide-react";
import {
  useGetProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/use-products";
import { uploadProductImageService } from "@/services/product.service";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { ProductModal } from "@/components/ui/product-modal";
import type { ProductUpdateData } from "@/components/ui/product-modal";
import type { Product } from "@/types";

const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
  const { data, isLoading, isError } = useGetProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);

  const products = data?.products ?? [];

  // Filter
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Stats
  const totalProducts = products.length;
  const totalInStock = products.filter((p) => p.countInStock > 0).length;
  const outOfStock = totalProducts - totalInStock;
  const totalValue = products.reduce(
    (sum, p) => sum + p.price * p.countInStock,
    0
  );

  const openCreate = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditTarget(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleCreate = (formData: FormData) => {
    createProduct.mutate(formData, {
      onSuccess: () => closeModal(),
    });
  };

  const handleUpdate = async (updateData: ProductUpdateData) => {
    if (!editTarget) return;
    const { keptImages, newFiles, ...fields } = updateData;

    try {
      // Upload new files one by one
      const uploadedImages = await Promise.all(
        newFiles.map((file) => {
          const fd = new FormData();
          fd.append("image", file);
          return uploadProductImageService(fd);
        })
      );

      // Merge kept existing images with newly uploaded ones
      const images = [
        ...keptImages,
        ...uploadedImages.map((img) => ({ url: img.url, public_id: img.public_id })),
      ];

      updateProduct.mutate(
        { id: editTarget._id, data: { ...fields, images } },
        { onSuccess: () => closeModal() }
      );
    } catch {
      // upload errors are already handled by axios interceptor
    }
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteProduct.mutate(deleteTarget._id, {
        onSettled: () => setDeleteTarget(null),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E272E]">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product catalog.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0984E3]/10">
            <Package className="h-5 w-5 text-[#0984E3]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-xl font-bold text-[#1E272E]">{totalProducts}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00CEC9]/10">
            <Archive className="h-5 w-5 text-[#00CEC9]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">In Stock</p>
            <p className="text-xl font-bold text-[#1E272E]">{totalInStock}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Out of Stock</p>
            <p className="text-xl font-bold text-[#1E272E]">{outOfStock}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E272E]/10">
            <DollarSign className="h-5 w-5 text-[#1E272E]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Inventory Value</p>
            <p className="text-xl font-bold text-[#1E272E]">
              ${totalValue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-9 w-full rounded-lg border border-gray-200 bg-[#F5F6FA] pl-9 pr-3 text-sm text-[#1E272E] placeholder:text-gray-400 focus:border-[#0984E3] focus:outline-none focus:ring-1 focus:ring-[#0984E3] sm:w-64"
            />
          </div>
          <p className="text-sm text-gray-500">
            Showing {paginated.length} of {filtered.length} products
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F5F6FA]">
                <th className="px-4 py-3 font-medium text-gray-500">
                  Product
                </th>
                <th className="px-4 py-3 font-medium text-gray-500">
                  Category
                </th>
                <th className="px-4 py-3 font-medium text-gray-500">Price</th>
                <th className="px-4 py-3 font-medium text-gray-500">Stock</th>
                <th className="px-4 py-3 font-medium text-gray-500">Rating</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <svg
                        className="h-5 w-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Loading products...
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-red-500"
                  >
                    Failed to load products. Please try again.
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                paginated.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-gray-50 transition-colors hover:bg-[#F5F6FA]/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-100">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                              <Package className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-[#1E272E]">
                            {product.name}
                          </p>
                          <p className="truncate text-xs text-gray-400">
                            {product.brand}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-[#0984E3]/10 px-2.5 py-0.5 text-xs font-medium text-[#0984E3]">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#1E272E]">
                      ${product.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.countInStock > 0
                            ? "bg-[#00CEC9]/10 text-[#00CEC9]"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {product.countInStock > 0
                          ? `${product.countInStock} in stock`
                          : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500">★</span>
                        {product.rating.toFixed(1)}
                        <span className="text-xs text-gray-400">
                          ({product.numReviews})
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#0984E3] hover:bg-[#0984E3]/10"
                          onClick={() => openEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => setDeleteTarget(product)}
                          disabled={deleteProduct.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Product Create/Edit Modal */}
      <ProductModal
        open={modalOpen}
        product={editTarget}
        isLoading={createProduct.isPending || updateProduct.isPending}
        onSubmit={handleCreate}
        onUpdate={handleUpdate}
        onCancel={closeModal}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleteProduct.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
