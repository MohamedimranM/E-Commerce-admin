"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/types";

interface BannerModalProps {
  open: boolean;
  banner: Banner | null;
  isLoading?: boolean;
  onSubmit: (formData: FormData) => void;
  onClose: () => void;
}

function BannerModalContent({
  banner,
  isLoading,
  onSubmit,
  onClose,
}: Omit<BannerModalProps, "open">) {
  const [name, setName] = useState(banner?.name ?? "");
  const [preview, setPreview] = useState<string | null>(
    banner?.image.url ?? null
  );
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    },
    [onClose, isLoading]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (file) {
      formData.append("image", file);
    }
    onSubmit(formData);
  };

  const isEdit = !!banner;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={() => !isLoading && onClose()}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15 }}
        className="relative z-10 mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={() => !isLoading && onClose()}
          className="absolute right-4 top-4 rounded-md p-1 text-gray-400 transition-colors hover:text-gray-600 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-lg font-semibold text-[#1E272E]">
          {isEdit ? "Edit Banner" : "Add Banner"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {isEdit
            ? "Update the banner name or image."
            : "Add a new banner with a name and image."}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1E272E]">
              Banner Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Summer Sale"
              required
              className="h-10 w-full rounded-lg border border-gray-200 bg-[#F5F6FA] px-3 text-sm text-[#1E272E] placeholder:text-gray-400 focus:border-[#0984E3] focus:outline-none focus:ring-1 focus:ring-[#0984E3]"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1E272E]">
              Banner Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {preview ? (
              <div className="relative overflow-hidden rounded-lg border border-gray-200">
                <Image
                  src={preview}
                  alt="Banner preview"
                  width={480}
                  height={200}
                  className="h-48 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    if (fileInputRef.current)
                      fileInputRef.current.value = "";
                  }}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-[#F5F6FA] text-gray-400 transition-colors hover:border-[#0984E3] hover:text-[#0984E3] cursor-pointer"
              >
                <Upload className="h-8 w-8" />
                <span className="text-sm">Click to upload image</span>
              </button>
            )}

            {preview && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-sm text-[#0984E3] hover:underline cursor-pointer"
              >
                Change image
              </button>
            )}
          </div>

          {/* Validation */}
          {!isEdit && !file && (
            <p className="text-xs text-gray-400">
              <ImageIcon className="mr-1 inline h-3 w-3" />
              Image is required for new banners.
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => !isLoading && onClose()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!name || (!isEdit && !file)}
            >
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function BannerModal({
  open,
  banner,
  isLoading = false,
  onSubmit,
  onClose,
}: BannerModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <BannerModalContent
          key={banner?._id ?? "new"}
          banner={banner}
          isLoading={isLoading}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}
