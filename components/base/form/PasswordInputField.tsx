"use client";

import Label from "./Label";
import { useState } from "react";
import { cn } from "@/utils/utils";
import { EyeIcon, EyeSlashIcon } from "@/public/assets/icons/icons";

const PasswordInputField = ({
  name,
  label,
  placeholder,
  errorMessage,
  required = false,
  register,
  className,
  ...rest
}: PasswordInputFieldProps) => {
  const [visiblePassword, setVisiblePassword] = useState(false);

  return (
    <div className="relative mb-3">
      <Label title={label} htmlFor={name} required={required} />

      <div className="relative">
        <input
          type={visiblePassword ? "text" : "password"}
          placeholder={placeholder || label}
          name={name}
          id={name}
          {...rest}
          {...(register ? register(name) : {})}
          className={cn("input", errorMessage ? "input-error" : "")}
        />

        <p
          className={cn(
            className,
            `absolute right-4 text-dark/45 top-1/2 text-[17px] -translate-y-1/2 cursor-pointer`
          )}
          onClick={() => setVisiblePassword(!visiblePassword)}
        >
          {visiblePassword ? (
            <EyeIcon className="size-[18px] opacity-65" />
          ) : (
            <EyeSlashIcon className="size-[18px] opacity-65" />
          )}

          <span
            className={cn(
              "absolute top-[40%] translate-y-1/2 left-0 w-full h-[2px] rotate-45",
              visiblePassword ? "" : "bg-dark/30"
            )}
          ></span>
        </p>
      </div>

      {errorMessage && <p className="input-error-message">{errorMessage}</p>}
    </div>
  );
};

export default PasswordInputField;
