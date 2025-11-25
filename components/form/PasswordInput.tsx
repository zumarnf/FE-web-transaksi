import { useState } from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput({ control, name, label, ...props }: any) {
  const [show, setShow] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1 relative">
          {label && <label className="text-sm font-medium">{label}</label>}
          <Input type={show ? "text" : "password"} {...field} {...props} />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-8"
            aria-label="Toggle password visibility"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {fieldState.error && (
            <p className="text-sm text-red-500">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
