"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import AuthCard from "@/components/auth/AuthCard";
import { InputField } from "@/components/form/InputField";
import { PasswordInput } from "@/components/form/PasswordInput";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { registerSchema, RegisterValues } from "@/validators/registerSchema";

export default function RegisterPage() {
  const router = useRouter();

  // useForm dengan Zod resolver
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  // Mutation TanStack Query
  const mutation = useMutation({
    mutationFn: async (values: RegisterValues) => {
      // Dummy API call
      const res = await api
        .post("/users/add", values)
        .catch(() => ({ data: { id: Date.now() } }));
      return res.data;
    },
    onSuccess: () => {
      toast.success("Registrasi berhasil, silakan login");
      router.push("/login");
    },
    onError: () => toast.error("Registrasi gagal"),
  });

  return (
    <AuthCard title="Register">
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <InputField control={form.control} name="username" label="Username" />
        <InputField
          control={form.control}
          name="email"
          label="Email (opsional)"
        />
        <PasswordInput
          control={form.control}
          name="password"
          label="Password"
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
