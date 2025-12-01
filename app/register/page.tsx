"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import AuthCard from "@/components/auth/AuthCard";
import { InputField } from "@/components/form/InputField";
import { PasswordInput } from "@/components/form/PasswordInput";
import { Button } from "@/components/ui/button";
import { authAPI } from "@/lib/api";
import { registerSchema, RegisterValues } from "@/validators/registerSchema";

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: RegisterValues) => {
      const res = await authAPI.register(values);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Registrasi berhasil! Silakan login");
      router.push("/login");
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || "Registrasi gagal";
      toast.error(errorMessage);
    },
  });

  return (
    <AuthCard title="Register">
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <InputField control={form.control} name="name" label="Nama Lengkap" />
        <InputField
          control={form.control}
          name="email"
          label="Email"
          type="email"
        />
        <PasswordInput
          control={form.control}
          name="password"
          label="Password"
        />
        <PasswordInput
          control={form.control}
          name="password_confirmation"
          label="Konfirmasi Password"
        />

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Memproses..." : "Daftar"}
        </Button>

        <p
          className="text-sm text-center mt-2 text-blue-600 underline cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Sudah punya akun? Login!
        </p>
      </form>
    </AuthCard>
  );
}
