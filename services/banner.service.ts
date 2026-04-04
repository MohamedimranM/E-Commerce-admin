import _axios from "@/lib/axios";
import type {
  BannersResponse,
  BannerResponse,
  DeleteResponse,
} from "@/types";

export const getBannersService = async () => {
  return await _axios<BannersResponse>("GET", "/banners");
};

export const getBannerByIdService = async (id: string) => {
  return await _axios<BannerResponse>("GET", `/banners/${id}`);
};

export const createBannerService = async (data: FormData) => {
  return await _axios<BannerResponse>("POST", "/banners", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateBannerService = async ({
  id,
  data,
}: {
  id: string;
  data: FormData;
}) => {
  return await _axios<BannerResponse>("PUT", `/banners/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteBannerService = async (id: string) => {
  return await _axios<DeleteResponse>("DELETE", `/banners/${id}`);
};
