"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { InputField } from "@/components/form/InputField";
import { PasswordInput } from "@/components/form/PasswordInput";
import { LoginSchema, loginSchema } from "@/validators/loginSchema";
import { authAPI } from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: LoginSchema) => {
      const res = await authAPI.login(values);
      return res.data;
    },

    onSuccess: (data) => {
      // Save token
      saveToken(data.token);
      localStorage.setItem("username", data.user.name || data.user.email);

      toast.success("Login berhasil!");

      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    },

    onError: (err: any) => {
      const errorMessage =
        err.response?.data?.message || "Login gagal. Coba lagi.";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutation.mutate(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-100">
      <div className="w-full max-w-xs bg-white shadow-lg rounded-2xl py-10 px-8 md:max-w-sm">
        <h1 className="text-center text-4xl font-extrabold mb-10">
          Yuk, Login
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Masukkan email"
              type="email"
            />

            <PasswordInput
              control={form.control}
              name="password"
              label="Password"
              placeholder="Masukkan password"
            />

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? "Memproses..." : "Login"}
            </Button>
          </form>

          <p
            className="text-sm text-center mt-4 text-blue-600 underline cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Belum punya akun? Daftar!
          </p>
        </Form>
      </div>
    </div>
  );
}
