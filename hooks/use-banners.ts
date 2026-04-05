"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getBannersService,
  createBannerService,
  updateBannerService,
  deleteBannerService,
} from "@/services/banner.service";

export const useGetBanners = () => {
  return useQuery({
    queryKey: ["banners"],
    queryFn: getBannersService,
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => createBannerService(data),
    onSuccess: async () => {
      toast.success("Banner created successfully");
      await queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to create banner"
      );
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; data: FormData }) =>
      updateBannerService(payload),
    onSuccess: async () => {
      toast.success("Banner updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to update banner"
      );
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBannerService(id),
    onSuccess: async (data) => {
      toast.success(data?.message || "Banner deleted successfully");
      await queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to delete banner"
      );
    },
  });
};
