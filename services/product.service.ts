import _axios from "@/lib/axios";
import type {
  ProductsResponse,
  ProductResponse,
  ProductPayload,
  DeleteResponse,
  ImageUploadResponse,
  BulkUploadResponse,
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

export const bulkUploadProductsService = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return await _axios<BulkUploadResponse>("POST", "/products/bulk-upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const downloadBulkTemplateService = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"}/products/bulk-template`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          typeof window !== "undefined" ? localStorage.getItem("token") : ""
        }`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to download template");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "product_upload_template.xlsx";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
