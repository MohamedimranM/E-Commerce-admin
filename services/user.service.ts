import _axios from "@/lib/axios";
import type { UsersResponse, UserResponse, DeleteResponse } from "@/types";

export const getUsersService = async () => {
  return await _axios<UsersResponse>("GET", "/users");
};

export const getUserByIdService = async (id: string) => {
  return await _axios<UserResponse>("GET", `/users/${id}`);
};

export const deleteUserService = async (id: string) => {
  return await _axios<DeleteResponse>("DELETE", `/users/${id}`);
};
