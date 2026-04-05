"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
} from "@/services/order.service";

export const useGetOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrdersService,
  });
};

export const useGetOrderById = (id: string) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrderByIdService(id),
    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; status: string }) =>
      updateOrderStatusService(payload),
    onSuccess: async (data) => {
      toast.success(`Order status updated to "${data?.order?.status}"`);
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update order status"
      );
    },
  });
};
