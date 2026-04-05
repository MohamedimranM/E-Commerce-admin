"use client";

import { useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Package,
  MapPin,
  CreditCard,
  Truck,
  User,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Order, OrderStatus } from "@/types";

const STATUS_OPTIONS: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const STATUS_DOT: Record<OrderStatus, string> = {
  Pending: "bg-amber-500",
  Confirmed: "bg-blue-500",
  Shipped: "bg-purple-500",
  Delivered: "bg-green-500",
  Cancelled: "bg-red-500",
};

interface OrderModalProps {
  open: boolean;
  order: Order | null;
  isUpdating: boolean;
  selectedStatus: OrderStatus | "";
  onSelectedStatusChange: (status: OrderStatus) => void;
  onStatusChange: (id: string, status: string) => void;
  onClose: () => void;
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-AE", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export function OrderModal({
  open,
  order,
  isUpdating,
  selectedStatus,
  onSelectedStatusChange,
  onStatusChange,
  onClose,
}: OrderModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isUpdating) onClose();
    },
    [onClose, isUpdating]
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

  if (!order) return null;

  const user =
    typeof order.user === "string"
      ? { name: "Unknown", email: "" }
      : order.user;

  const handleUpdateStatus = () => {
    if (selectedStatus && selectedStatus !== order.status) {
      onStatusChange(order._id, selectedStatus);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8">
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={() => !isUpdating && onClose()}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 mx-4 w-full max-w-2xl rounded-xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#1E272E]">
                  Order #{order._id.slice(-8).toUpperCase()}
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <button
                onClick={() => !isUpdating && onClose()}
                className="cursor-pointer rounded-md p-1 text-gray-400 transition-colors hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {/* Status + Update */}
              <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-[#F5F6FA] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[order.status]}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${STATUS_DOT[order.status]}`}
                    />
                    {order.status}
                  </span>
                  {order.isPaid && (
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      Paid
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      onSelectedStatusChange(e.target.value as OrderStatus)
                    }
                    disabled={isUpdating}
                    className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-[#1E272E] focus:border-[#0984E3] focus:outline-none focus:ring-1 focus:ring-[#0984E3]"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    onClick={handleUpdateStatus}
                    disabled={
                      isUpdating || selectedStatus === order.status || !selectedStatus
                    }
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </Button>
                </div>
              </div>

              {/* Customer & Shipping */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Customer */}
                <div className="rounded-xl border border-gray-100 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1E272E]">
                    <User className="h-4 w-4 text-[#0984E3]" />
                    Customer
                  </div>
                  <p className="text-sm font-medium text-[#1E272E]">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>

                {/* Shipping Address */}
                <div className="rounded-xl border border-gray-100 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1E272E]">
                    <MapPin className="h-4 w-4 text-[#0984E3]" />
                    Shipping Address
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.fullName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </div>

              {/* Payment & Dates */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1E272E]">
                    <CreditCard className="h-4 w-4 text-[#0984E3]" />
                    Payment
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.paymentMethod}
                  </p>
                  {order.isPaid && (
                    <p className="text-xs text-green-600">
                      Paid on {formatDate(order.paidAt)}
                    </p>
                  )}
                </div>
                <div className="rounded-xl border border-gray-100 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1E272E]">
                    <Truck className="h-4 w-4 text-[#0984E3]" />
                    Delivery
                  </div>
                  {order.isDelivered ? (
                    <p className="text-xs text-green-600">
                      Delivered on {formatDate(order.deliveredAt)}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Not delivered yet</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                  <Package className="h-4 w-4 text-[#0984E3]" />
                  <h3 className="text-sm font-semibold text-[#1E272E]">
                    Items ({order.orderItems.length})
                  </h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {order.orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 px-4 py-3"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-1"
                            sizes="48px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-300">
                            <Package className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-[#1E272E]">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[#1E272E]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-100 px-4 py-3 space-y-1.5">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.itemsPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping</span>
                    <span>
                      {order.shippingPrice === 0
                        ? "Free"
                        : formatPrice(order.shippingPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-[#1E272E]">
                    <span>Total</span>
                    <span>{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="rounded-xl border border-gray-100 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1E272E]">
                  <Clock className="h-4 w-4 text-[#0984E3]" />
                  Timeline
                </div>
                <div className="space-y-2 text-xs text-gray-500">
                  <p>Order placed: {formatDate(order.createdAt)}</p>
                  {order.paidAt && <p>Payment received: {formatDate(order.paidAt)}</p>}
                  {order.deliveredAt && (
                    <p>Delivered: {formatDate(order.deliveredAt)}</p>
                  )}
                  <p>Last updated: {formatDate(order.updatedAt)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
