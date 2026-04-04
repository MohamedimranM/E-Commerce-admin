"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ImageIcon,
  Trash2,
  Pencil,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useGetBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
} from "@/hooks/use-banners";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { BannerModal } from "@/components/ui/banner-modal";
import type { Banner } from "@/types";

const ITEMS_PER_PAGE = 8;

export default function BannersPage() {
  const { data, isLoading, isError } = useGetBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Banner | null>(null);

  const banners = data?.banners ?? [];

  // Filter
  const filtered = banners.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const openCreate = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (banner: Banner) => {
    setEditTarget(banner);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleCreate = (formData: FormData) => {
    createBanner.mutate(formData, {
      onSuccess: () => closeModal(),
    });
  };

  const handleUpdate = (formData: FormData) => {
    if (!editTarget) return;
    updateBanner.mutate(
      { id: editTarget._id, data: formData },
      { onSuccess: () => closeModal() }
    );
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteBanner.mutate(deleteTarget._id, {
        onSettled: () => setDeleteTarget(null),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E272E]">
            Application Images
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your banner images.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Banner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0984E3]/10">
            <ImageIcon className="h-5 w-5 text-[#0984E3]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Banners</p>
            <p className="text-xl font-bold text-[#1E272E]">
              {banners.length}
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
              placeholder="Search banners..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-9 w-full rounded-lg border border-gray-200 bg-[#F5F6FA] pl-9 pr-3 text-sm text-[#1E272E] placeholder:text-gray-400 focus:border-[#0984E3] focus:outline-none focus:ring-1 focus:ring-[#0984E3] sm:w-64"
            />
          </div>
          <p className="text-sm text-gray-500">
            Showing {paginated.length} of {filtered.length} banners
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F5F6FA]">
                <th className="px-4 py-3 font-medium text-gray-500">Image</th>
                <th className="px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 font-medium text-gray-500">
                  Created At
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
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
                      Loading banners...
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-red-500"
                  >
                    Failed to load banners. Please try again.
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    No banners found.
                  </td>
                </tr>
              ) : (
                paginated.map((banner) => (
                  <tr
                    key={banner._id}
                    className="border-b border-gray-50 transition-colors hover:bg-[#F5F6FA]/50"
                  >
                    <td className="px-4 py-3">
                      <div className="h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-gray-100">
                        <Image
                          src={banner.image.url}
                          alt={banner.name}
                          width={112}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#1E272E]">
                        {banner.name}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {banner.createdAt
                        ? new Date(banner.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#0984E3] hover:bg-[#0984E3]/10"
                          onClick={() => openEdit(banner)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => setDeleteTarget(banner)}
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
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
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

      {/* Banner Modal (Create / Edit) */}
      <BannerModal
        open={modalOpen}
        banner={editTarget}
        isLoading={createBanner.isPending || updateBanner.isPending}
        onSubmit={editTarget ? handleUpdate : handleCreate}
        onClose={closeModal}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Banner"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleteBanner.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
