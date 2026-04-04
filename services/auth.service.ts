import _axios from "@/lib/axios";
import type { AuthResponse } from "@/types";

export const loginService = async (data: {
  email: string;
  password: string;
}) => {
  return await _axios<AuthResponse>("POST", "/auth/signin", data);
};
