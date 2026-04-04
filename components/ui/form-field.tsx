"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  error?: string;
  touched?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  className?: string;
}

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  error,
  touched,
  onChange,
  onBlur,
  className,
}: FormFieldProps) {
  const showError = touched && error;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} error={!!showError}>
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={showError ? error : undefined}
        autoComplete={type === "password" ? "current-password" : "email"}
      />
      {showError && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
