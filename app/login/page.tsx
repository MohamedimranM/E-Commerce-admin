"use client";

import { useFormik } from "formik";
import { ShoppingBag, LogIn } from "lucide-react";

import { loginSchema } from "@/lib/validations/auth.validation";
import { useLogin } from "@/hooks/use-auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";

export default function LoginPage() {
  const loginMutation = useLogin();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      loginMutation.mutate(values);
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F6FA] px-4">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#0984E3]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#00CEC9]/10 blur-3xl" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-0 shadow-xl">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0984E3]">
            <ShoppingBag className="h-7 w-7 text-white" />
          </div>
          <CardTitle className="text-[#1E272E]">Admin Panel</CardTitle>
          <CardDescription>
            Sign in to manage your e-commerce store
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              value={formik.values.email}
              error={formik.errors.email}
              touched={formik.touched.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formik.values.password}
              error={formik.errors.password}
              touched={formik.touched.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={loginMutation.isPending}
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
