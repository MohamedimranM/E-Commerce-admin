"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ReviewModalProps {
  open: boolean;
  productName: string;
  isLoading?: boolean;
  onSubmit: (data: { rating: number; comment: string }) => void;
  onCancel: () => void;
}

export function ReviewModal({
  open,
  productName,
  isLoading = false,
  onSubmit,
  onCancel,
}: ReviewModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Reset state when modal closes — derive from open prop
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>(
    {}
  );
  const [lastOpen, setLastOpen] = useState(open);
  if (lastOpen !== open) {
    setLastOpen(open);
    if (!open) {
      setRating(0);
      setHoverRating(0);
      setComment("");
      setErrors({});
    }
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onCancel();
    },
    [onCancel, isLoading]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  const handleSubmit = () => {
    const newErrors: { rating?: string; comment?: string } = {};
    if (rating === 0) newErrors.rating = "Please select a rating";
    if (!comment.trim()) newErrors.comment = "Comment is required";
    else if (comment.trim().length < 5)
      newErrors.comment = "Comment must be at least 5 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({ rating, comment: comment.trim() });
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={() => !isLoading && onCancel()}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
          >
            <button
              onClick={() => !isLoading && onCancel()}
              className="absolute right-4 top-4 rounded-md p-1 text-gray-400 transition-colors hover:text-gray-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-lg font-semibold text-[#1E272E]">
              Add Review
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Write a review for{" "}
              <span className="font-medium text-[#1E272E]">{productName}</span>
            </p>

            <div className="mt-6 space-y-4">
              {/* Star Rating */}
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="cursor-pointer p-0.5 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          star <= (hoverRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-none text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 self-center text-sm text-gray-500">
                      {rating}/5
                    </span>
                  )}
                </div>
                {errors.rating && (
                  <p className="text-xs text-red-500">{errors.rating}</p>
                )}
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label htmlFor="review-comment" error={!!errors.comment}>
                  Comment
                </Label>
                <textarea
                  id="review-comment"
                  rows={4}
                  placeholder="Share your experience with this product..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className={`flex w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 transition-colors resize-none ${
                    errors.comment
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-gray-300 focus-visible:ring-[#0984E3]"
                  }`}
                />
                {errors.comment && (
                  <p className="text-xs text-red-500">{errors.comment}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
