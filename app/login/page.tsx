"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/form/InputField";
import { PasswordInput } from "@/components/form/PasswordInput";
import { LoginSchema, loginSchema } from "@/validators/loginSchema";
import { saveToken } from "@/lib/auth";
import { useLogin } from "@/lib/useProducts";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginSchema) => {
    login.mutate(values, {
      onSuccess: (res) => {
        saveToken(res.data.token);
        localStorage.setItem(
          "username",
          res.data.user.name || res.data.user.email
        );

        toast.success("Login berhasil!");
        router.push("/dashboard");
      },

      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Login gagal. Coba lagi.");
      },
    });
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

            <Button type="submit" disabled={login.isPending} className="w-full">
              {login.isPending ? "Memproses..." : "Login"}
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
