import _axios from "@/lib/axios";
import type { AddReviewResponse, ReviewPayload } from "@/types";

export const addReviewService = async ({
  productId,
  data,
}: {
  productId: string;
  data: ReviewPayload;
}) => {
  return await _axios<AddReviewResponse>(
    "POST",
    `/products/${productId}/reviews`,
    data
  );
};
