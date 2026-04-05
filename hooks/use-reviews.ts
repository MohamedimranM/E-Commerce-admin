"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addReviewService } from "@/services/review.service";
import type { ReviewPayload } from "@/types";

export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { productId: string; data: ReviewPayload }) =>
      addReviewService(payload),
    onSuccess: async (data) => {
      toast.success(data?.message || "Review added successfully");
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to add review"
      );
    },
  });
};
