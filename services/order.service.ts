import _axios from "@/lib/axios";
import type { OrdersResponse, OrderResponse } from "@/types";

export const getAllOrdersService = async () => {
  return await _axios<OrdersResponse>("GET", "/orders");
};

export const getOrderByIdService = async (id: string) => {
  return await _axios<OrderResponse>("GET", `/orders/${id}`);
};

export const updateOrderStatusService = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  return await _axios<OrderResponse>("PUT", `/orders/${id}/status`, { status });
};
