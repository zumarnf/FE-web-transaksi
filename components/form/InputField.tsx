import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";

export function InputField({ control, name, label, ...props }: any) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1">
          {label && <label className="text-xs font-medium">{label}</label>}
          <Input {...field} {...props} />
          {fieldState.error && (
            <p className="text-sm text-red-500">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
