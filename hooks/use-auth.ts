"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { loginService } from "@/services/auth.service";
import { store } from "@/store";
import { setCredentials } from "@/store/features/auth-slice";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      loginService(data),
    onSuccess: (data) => {
      toast.success(data?.message);
      store.dispatch(
        setCredentials({
          user: data.user,
          token: data.token,
        })
      );
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(
        err?.response?.data?.message || err?.message || "Login failed"
      );
    },
  });
};
