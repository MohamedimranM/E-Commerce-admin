"use client";

import { useState, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  DollarSign,
  Clock,
  CheckCircle2,
  Package,
} from "lucide-react";
import { useGetOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { OrderModal } from "@/components/ui/order-modal";
import type { Order, OrderStatus } from "@/types";

const ITEMS_PER_PAGE = 8;

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

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(n);

export default function OrdersPage() {
  const { data, isLoading, isError } = useGetOrders();
  const updateStatus = useUpdateOrderStatus();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalStatus, setModalStatus] = useState<OrderStatus | "">("");

  const orders = useMemo(() => data?.orders ?? [], [data?.orders]);
  const totalRevenue = data?.totalRevenue ?? 0;

  // Filter
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const user =
        typeof o.user === "string" ? { name: "", email: "" } : o.user;
      const matchesSearch =
        o._id.toLowerCase().includes(search.toLowerCase()) ||
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? o.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Stats
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

  const handleStatusChange = (id: string, status: string) => {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => {
          if (selectedOrder && selectedOrder._id === id) {
            setSelectedOrder((prev) =>
              prev ? { ...prev, status: status as OrderStatus } : null
            );
          }
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E272E]">Manage Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage all customer orders.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0984E3]/10">
            <ShoppingBag className="h-5 w-5 text-[#0984E3]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-xl font-bold text-[#1E272E]">{orders.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-xl font-bold text-[#1E272E]">
              {formatPrice(totalRevenue)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-xl font-bold text-[#1E272E]">{pendingCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00CEC9]/10">
            <CheckCircle2 className="h-5 w-5 text-[#00CEC9]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Delivered</p>
            <p className="text-xl font-bold text-[#1E272E]">
              {deliveredCount}
            </p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="h-9 w-full rounded-lg border border-gray-200 bg-[#F5F6FA] pl-9 pr-3 text-sm text-[#1E272E] placeholder:text-gray-400 focus:border-[#0984E3] focus:outline-none focus:ring-1 focus:ring-[#0984E3] sm:w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as OrderStatus | "");
                setPage(1);
              }}
              className="cursor-pointer h-9 rounded-lg border border-gray-200 bg-[#F5F6FA] px-3 text-sm text-[#1E272E] focus:border-[#0984E3] focus:outline-none focus:ring-1 focus:ring-[#0984E3]"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <p className="text-sm text-gray-500">
            Showing {paginated.length} of {filtered.length} orders
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F5F6FA]">
                <th className="px-4 py-3 font-medium text-gray-500">
                  Order ID
                </th>
                <th className="px-4 py-3 font-medium text-gray-500">
                  Customer
                </th>
                <th className="px-4 py-3 font-medium text-gray-500">Items</th>
                <th className="px-4 py-3 font-medium text-gray-500">Total</th>
                <th className="px-4 py-3 font-medium text-gray-500">
                  Payment
                </th>
                <th className="px-4 py-3 font-medium text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <svg
                        className="h-5 w-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-red-500"
                  >
                    Failed to load orders. Please try again.
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                paginated.map((order) => {
                  const user =
                    typeof order.user === "string"
                      ? { name: "Unknown", email: "" }
                      : order.user;
                  return (
                    <tr
                      key={order._id}
                      className="border-b border-gray-50 transition-colors hover:bg-[#F5F6FA]/50"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-medium text-[#0984E3]">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-[#1E272E]">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {order.orderItems.length}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#1E272E]">
                        {formatPrice(order.totalPrice)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-600">
                            {order.paymentMethod}
                          </span>
                          {order.isPaid && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[order.status]}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[order.status]}`}
                          />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-AE",
                              {
                                day: "numeric",
                                month: "short",
                              }
                            )
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#0984E3] hover:bg-[#0984E3]/10"
                          onClick={() => {
                            setSelectedOrder(order);
                            setModalStatus(order.status);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <OrderModal
        open={!!selectedOrder}
        order={selectedOrder}
        isUpdating={updateStatus.isPending}
        selectedStatus={modalStatus}
        onSelectedStatusChange={(s) => setModalStatus(s)}
        onStatusChange={handleStatusChange}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
