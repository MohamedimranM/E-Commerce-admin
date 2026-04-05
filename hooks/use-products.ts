"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} from "@/services/product.service";
import type { ProductPayload } from "@/types";

export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProductsService,
  });
};

export const useGetProductById = (id: string) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductByIdService(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => createProductService(data),
    onSuccess: async () => {
      toast.success("Product created successfully");
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to create product"
      );
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; data: Partial<ProductPayload> }) =>
      updateProductService(payload),
    onSuccess: async () => {
      toast.success("Product updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to update product"
      );
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProductService(id),
    onSuccess: async (data) => {
      toast.success(data?.message || "Product deleted successfully");
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to delete product"
      );
    },
  });
};
