"use client";

import { useState, useRef } from "react";
import { X, Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./button";
import { useBulkUploadProducts, useDownloadBulkTemplate } from "@/hooks/use-products";
import type { BulkUploadResponse } from "@/types";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulkUploadModal({ isOpen, onClose }: BulkUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<BulkUploadResponse["results"] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bulkUpload = useBulkUploadProducts();
  const downloadTemplate = useDownloadBulkTemplate();

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];
      if (!validTypes.includes(file.type) && !file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        alert("Please select a valid Excel file (.xlsx or .xls)");
        return;
      }
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    bulkUpload.mutate(selectedFile, {
      onSuccess: (data) => {
        setUploadResult(data.results);
      },
    });
  };

  const handleDownloadTemplate = () => {
    downloadTemplate.mutate();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0984E3]/10">
              <FileSpreadsheet className="h-5 w-5 text-[#0984E3]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1E272E]">Bulk Upload Products</h2>
              <p className="text-sm text-gray-500">Upload multiple products using Excel file</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Instructions */}
          <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <h3 className="mb-2 font-medium text-[#1E272E]">Instructions:</h3>
            <ol className="space-y-1 text-sm text-gray-600">
              <li>1. Download the Excel template below</li>
              <li>2. Fill in your product details (all required fields)</li>
              <li>3. Upload the completed Excel file</li>
              <li>4. Review the results and fix any errors if needed</li>
            </ol>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                isLoading={downloadTemplate.isPending}
              >
                <Download className="h-4 w-4" />
                Download Template
              </Button>
            </div>
          </div>

          {/* File Upload Area */}
          {!uploadResult && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-[#1E272E]">
                Select Excel File
              </label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="bulk-upload-file"
                />
                <label
                  htmlFor="bulk-upload-file"
                  className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 text-sm text-gray-600 transition-colors hover:border-[#0984E3] hover:bg-blue-50 hover:text-[#0984E3]"
                >
                  <Upload className="h-4 w-4" />
                  {selectedFile ? selectedFile.name : "Choose Excel file or drag & drop"}
                </label>
                {selectedFile && (
                  <Button
                    onClick={handleUpload}
                    isLoading={bulkUpload.isPending}
                    disabled={!selectedFile}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Products
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {bulkUpload.isPending && (
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
              <div className="mx-auto mb-3 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#0984E3]" />
              <p className="text-sm font-medium text-[#1E272E]">Processing your file...</p>
              <p className="text-xs text-gray-500">Please wait while we upload your products</p>
            </div>
          )}

          {/* Results */}
          {uploadResult && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-gray-100 bg-white p-4 text-center">
                  <div className="text-2xl font-bold text-[#1E272E]">{uploadResult.total}</div>
                  <div className="text-sm text-gray-500">Total Rows</div>
                </div>
                <div className="rounded-lg border border-green-100 bg-green-50 p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-2xl font-bold text-green-600">
                    <CheckCircle className="h-6 w-6" />
                    {uploadResult.successful.length}
                  </div>
                  <div className="text-sm text-green-700">Successful</div>
                </div>
                <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-2xl font-bold text-red-600">
                    <AlertCircle className="h-6 w-6" />
                    {uploadResult.failed.length}
                  </div>
                  <div className="text-sm text-red-700">Failed</div>
                </div>
              </div>

              {/* Failed Items Details */}
              {uploadResult.failed.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <h3 className="mb-3 font-medium text-red-900">Failed Items:</h3>
                  <div className="max-h-60 space-y-2 overflow-y-auto">
                    {uploadResult.failed.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-red-200 bg-white p-3 text-sm"
                      >
                        <div className="font-medium text-[#1E272E]">
                          Row {item.row}: {item.data?.name || "Unknown"}
                        </div>
                        <div className="mt-1 text-red-600">{item.error}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Message */}
              {uploadResult.successful.length > 0 && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">
                      {uploadResult.successful.length} product(s) uploaded successfully!
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setUploadResult(null);
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Upload Another File
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
