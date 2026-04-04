import _axios from "@/lib/axios";
import type {
  ProductsResponse,
  ProductResponse,
  ProductPayload,
  DeleteResponse,
  ImageUploadResponse,
} from "@/types";

export const getProductsService = async () => {
  return await _axios<ProductsResponse>("GET", "/products");
};

export const getProductByIdService = async (id: string) => {
  return await _axios<ProductResponse>("GET", `/products/${id}`);
};

export const createProductService = async (data: FormData) => {
  return await _axios<ProductResponse>("POST", "/products", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateProductService = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<ProductPayload>;
}) => {
  return await _axios<ProductResponse>("PUT", `/products/${id}`, data);
};

export const deleteProductService = async (id: string) => {
  return await _axios<DeleteResponse>("DELETE", `/products/${id}`);
};

export const uploadProductImageService = async (data: FormData) => {
  return await _axios<ImageUploadResponse>("POST", "/products/upload", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
