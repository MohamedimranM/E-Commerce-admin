"use client";

import { useState, useMemo } from "react";
import {
  Star,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import Image from "next/image";
import { useGetProducts } from "@/hooks/use-products";
import { useAddReview } from "@/hooks/use-reviews";
import { Button } from "@/components/ui/button";
import { ReviewModal } from "@/components/ui/review-modal";
import type { Product, Review } from "@/types";

interface FlatReview extends Review {
  productId: string;
  productName: string;
  productImage?: string;
}

const ITEMS_PER_PAGE = 8;

export default function ReviewsPage() {
  const { data, isLoading, isError } = useGetProducts();
  const addReview = useAddReview();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products = useMemo(() => data?.products ?? [], [data?.products]);

  // Flatten all reviews from all products
  const allReviews = useMemo<FlatReview[]>(() => {
    return products.flatMap((product) =>
      (product.reviews || []).map((review) => ({
        ...review,
        productId: product._id,
        productName: product.name,
        productImage: product.images?.[0]?.url,
      }))
    );
  }, [products]);

  // Sort by newest first
  const sortedReviews = useMemo(() => {
    return [...allReviews].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [allReviews]);

  // Filter
  const filtered = sortedReviews.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      r.productName.toLowerCase().includes(search.toLowerCase());
    const matchesRating = ratingFilter ? r.rating === ratingFilter : true;
    return matchesSearch && matchesRating;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Stats
  const totalReviews = allReviews.length;
  const averageRating =
    totalReviews > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
  const fiveStarCount = allReviews.filter((r) => r.rating === 5).length;

  // Rating distribution
  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    allReviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) dist[r.rating - 1]++;
    });
    return dist;
  }, [allReviews]);

  const openAddReview = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handleSubmitReview = (data: { rating: number; comment: string }) => {
    if (!selectedProduct) return;
    addReview.mutate(
      { productId: selectedProduct._id, data },
      { onSuccess: () => setModalOpen(false) }
    );
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E272E]">Reviews</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all product reviews.
          </p>
        </div>
        <Button onClick={openAddReview}>
          <Plus className="h-4 w-4" />
          Add Review
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0984E3]/10">
            <MessageSquare className="h-5 w-5 text-[#0984E3]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Reviews</p>
            <p className="text-xl font-bold text-[#1E272E]">{totalReviews}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
            <TrendingUp className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Average Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-[#1E272E]">
                {averageRating.toFixed(1)}
              </p>
              {renderStars(Math.round(averageRating))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00CEC9]/10">
            <Star className="h-5 w-5 text-[#00CEC9]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">5-Star Reviews</p>
            <p className="text-xl font-bold text-[#1E272E]">{fiveStarCount}</p>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-600">
            Rating Distribution
          </h3>
        </div>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star - 1];
            const percent =
              totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <button
                key={star}
                onClick={() =>
                  setRatingFilter((prev) => (prev === star ? null : star))
                }
                className={`flex w-full items-center gap-3 rounded-lg px-2 py-1 text-left transition-colors cursor-pointer ${
                  ratingFilter === star
                    ? "bg-[#0984E3]/10"
                    : "hover:bg-gray-50"
                }`}
              >
                <span className="w-8 text-sm font-medium text-gray-600">
                  {star}★
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs text-gray-500">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        {ratingFilter && (
          <button
            onClick={() => setRatingFilter(null)}
            className="mt-2 text-xs text-[#0984E3] hover:underline cursor-pointer"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Reviews Table */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-9 w-full rounded-lg border border-gray-200 bg-[#F5F6FA] pl-9 pr-3 text-sm text-[#1E272E] placeholder:text-gray-400 focus:border-[#0984E3] focus:outline-none focus:ring-1 focus:ring-[#0984E3] sm:w-64"
            />
          </div>
          <p className="text-sm text-gray-500">
            Showing {paginated.length} of {filtered.length} reviews
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
                  Reviewer
                </th>
                <th className="px-4 py-3 font-medium text-gray-500">Rating</th>
                <th className="px-4 py-3 font-medium text-gray-500">
                  Comment
                </th>
                <th className="px-4 py-3 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
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
                      Loading reviews...
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-red-500"
                  >
                    Failed to load reviews. Please try again.
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    No reviews found.
                  </td>
                </tr>
              ) : (
                paginated.map((review) => (
                  <tr
                    key={review._id}
                    className="border-b border-gray-50 transition-colors hover:bg-[#F5F6FA]/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-gray-100">
                          {review.productImage ? (
                            <Image
                              src={review.productImage}
                              alt={review.productName}
                              width={36}
                              height={36}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                              <Star className="h-3 w-3 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <span className="max-w-35 truncate font-medium text-[#1E272E]">
                          {review.productName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0984E3] text-[10px] font-bold text-white">
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-600">{review.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{renderStars(review.rating)}</td>
                    <td className="max-w-65 px-4 py-3">
                      <p className="truncate text-gray-600">{review.comment}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : "—"}
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

      {/* Add Review Modal — product selector when no product is pre-selected */}
      {modalOpen && !selectedProduct ? (
        <ProductSelector
          products={products}
          onSelect={(p) => setSelectedProduct(p)}
          onCancel={() => setModalOpen(false)}
        />
      ) : (
        <ReviewModal
          open={modalOpen && !!selectedProduct}
          productName={selectedProduct?.name ?? ""}
          isLoading={addReview.isPending}
          onSubmit={handleSubmitReview}
          onCancel={() => {
            setModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}

// ── Product Selector Modal ─────────────────────────────────
function ProductSelector({
  products,
  onSelect,
  onCancel,
}: {
  products: Product[];
  onSelect: (product: Product) => void;
  onCancel: () => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />
      <div className="relative z-10 mx-4 w-full max-w-md max-h-[80vh] flex flex-col rounded-xl bg-white shadow-2xl">
        <div className="border-b border-gray-100 p-4">
          <h2 className="text-lg font-semibold text-[#1E272E]">
            Select a Product
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose which product to review.
          </p>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-[#F5F6FA] pl-9 pr-3 text-sm text-[#1E272E] placeholder:text-gray-400 focus:border-[#0984E3] focus:outline-none focus:ring-1 focus:ring-[#0984E3]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No products found.
            </p>
          ) : (
            filtered.map((product) => (
              <button
                key={product._id}
                onClick={() => onSelect(product)}
                className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-[#F5F6FA] cursor-pointer"
              >
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
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                      <Star className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[#1E272E]">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-400">{product.brand}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {product.rating.toFixed(1)}
                  <span className="text-gray-400">
                    ({product.numReviews})
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
        <div className="border-t border-gray-100 p-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
