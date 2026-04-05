"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import Image from "next/image";
import { X, Upload, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { productSchema } from "@/lib/validations/product.validation";
import type { Product, ProductImage } from "@/types";

export interface ProductUpdateData {
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
  keptImages: ProductImage[];
  newFiles: File[];
}

interface ProductModalProps {
  open: boolean;
  product?: Product | null;
  isLoading?: boolean;
  onSubmit: (formData: FormData) => void;
  onUpdate: (data: ProductUpdateData) => void;
  onCancel: () => void;
}

export function ProductModal({
  open,
  product,
  isLoading = false,
  onSubmit,
  onUpdate,
  onCancel,
}: ProductModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [keptImages, setKeptImages] = useState<ProductImage[]>([]);

  const isEditMode = !!product;

  const formik = useFormik({
    initialValues: {
      name: "",
      brand: "",
      category: "",
      description: "",
      price: "",
      countInStock: "",
    },
    validationSchema: productSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (isEditMode) {
        onUpdate({
          name: values.name,
          brand: values.brand,
          category: values.category,
          description: values.description,
          price: Number(values.price),
          countInStock: Number(values.countInStock),
          keptImages,
          newFiles: selectedFiles,
        });
      } else {
        if (selectedFiles.length === 0) return;
        const fd = new FormData();
        fd.append("name", values.name);
        fd.append("brand", values.brand);
        fd.append("category", values.category);
        fd.append("description", values.description);
        fd.append("price", String(values.price));
        fd.append("countInStock", String(values.countInStock));
        selectedFiles.forEach((file) => fd.append("images", file));
        onSubmit(fd);
      }
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (product && open) {
      formik.setValues({
        name: product.name,
        brand: product.brand,
        category: product.category,
        description: product.description,
        price: String(product.price),
        countInStock: String(product.countInStock),
      });
      setPreviewImages(product.images.map((img) => img.url));
      setKeptImages([...product.images]);
      setSelectedFiles([]);
    }
    if (!open) {
      formik.resetForm();
      setPreviewImages([]);
      setKeptImages([]);
      setSelectedFiles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, open]);

  // Close on Escape
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newFiles = files.slice(0, 5 - selectedFiles.length);
    setSelectedFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so same file can be selected again
    e.target.value = "";
  };

  const removeNewImage = (index: number) => {
    const existingCount = keptImages.length;

    if (index < existingCount) {
      // Removing an existing image
      setKeptImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Removing a newly selected file
      const fileIndex = index - existingCount;
      setSelectedFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const showError = (field: keyof typeof formik.values) =>
    formik.touched[field] && formik.errors[field]
      ? formik.errors[field]
      : undefined;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={() => !isLoading && onCancel()}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 mx-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={() => !isLoading && onCancel()}
              className="absolute right-4 top-4 rounded-md p-1 text-gray-400 transition-colors hover:text-gray-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-lg font-semibold text-[#1E272E]">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? "Update the product details below."
                : "Fill in the details to create a new product."}
            </p>

            <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
              {/* Name & Brand */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" error={!!showError("name")}>
                    Product Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. iPhone 15 Pro"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={showError("name")}
                  />
                  {showError("name") && (
                    <p className="text-xs text-red-500">
                      {formik.errors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand" error={!!showError("brand")}>
                    Brand
                  </Label>
                  <Input
                    id="brand"
                    name="brand"
                    placeholder="e.g. Apple"
                    value={formik.values.brand}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={showError("brand")}
                  />
                  {showError("brand") && (
                    <p className="text-xs text-red-500">
                      {formik.errors.brand}
                    </p>
                  )}
                </div>
              </div>

              {/* Category & Price */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category" error={!!showError("category")}>
                    Category
                  </Label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="e.g. Electronics"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={showError("category")}
                  />
                  {showError("category") && (
                    <p className="text-xs text-red-500">
                      {formik.errors.category}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" error={!!showError("price")}>
                    Price (AED)
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="0.00"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={showError("price")}
                  />
                  {showError("price") && (
                    <p className="text-xs text-red-500">
                      {formik.errors.price}
                    </p>
                  )}
                </div>
              </div>

              {/* Stock */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="countInStock"
                    error={!!showError("countInStock")}
                  >
                    Stock Count
                  </Label>
                  <Input
                    id="countInStock"
                    name="countInStock"
                    type="number"
                    placeholder="0"
                    value={formik.values.countInStock}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={showError("countInStock")}
                  />
                  {showError("countInStock") && (
                    <p className="text-xs text-red-500">
                      {formik.errors.countInStock}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  error={!!showError("description")}
                >
                  Description
                </Label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Describe the product..."
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`flex w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none ${
                    showError("description")
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-gray-300 focus-visible:ring-[#0984E3]"
                  }`}
                />
                {showError("description") && (
                  <p className="text-xs text-red-500">
                    {formik.errors.description}
                  </p>
                )}
              </div>

              {/* Images */}
              <div className="space-y-2">
                <Label>Images {!isEditMode && "(required, max 5)"}</Label>
                <div className="flex flex-wrap gap-3">
                  {previewImages.map((src, i) => (
                    <div
                      key={i}
                      className="group relative h-20 w-20 rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <Image
                        src={src}
                        alt={`Preview ${i + 1}`}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                        unoptimized={src.startsWith("data:")}
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}
                  {(isEditMode || previewImages.length < 5) && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-[#0984E3] hover:text-[#0984E3] cursor-pointer"
                    >
                      {previewImages.length === 0 ? (
                        <ImageIcon className="h-5 w-5" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      <span className="text-[10px]">Upload</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                {!isEditMode &&
                  selectedFiles.length === 0 &&
                  formik.submitCount > 0 && (
                    <p className="text-xs text-red-500">
                      At least one image is required
                    </p>
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
                  type="submit"
                  className="flex-1"
                  isLoading={isLoading}
                >
                  {isEditMode ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
