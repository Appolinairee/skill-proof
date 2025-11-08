"use client";

import React from "react";
import { cn } from "@/utils/utils";
import Label from "./Label";

interface PhoneNumberFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "onChange"
  > {
  label: string;
  name: string;
  errorMessage?: string | null;
  required?: boolean;
  icon?: React.ReactNode;
  onChange: (value: string) => void;
  value?: string;
  // register?: any;
}

const formatPhoneNumber = (value: string) => {
  const cleanValue = value.replace(/^\+22901/, "").replace(/\D/g, "");

  const limitedNumbers = cleanValue.slice(0, 8);

  const groups = [];
  for (let i = 0; i < limitedNumbers.length; i += 2) {
    groups.push(limitedNumbers.slice(i, i + 2));
  }

  return groups.join(" ");
};

const PhoneNumberField = React.forwardRef<
  HTMLInputElement,
  PhoneNumberFieldProps
>(
  (
    {
      value = "",
      label,
      name,
      errorMessage,
      required,
      className,
      // register,
      icon,
      placeholder = "XX XX XX XX",
      ...rest
    },
    ref
  ) => {
    return (
      <div className="mb-3">
        {label && (
          <Label title={label} htmlFor={name} icon={icon} required={required} />
        )}
        <div className="relative">
          <div className="absolute inset-y-0 left-[2px] top-[2px] h-[calc(100%-4px)] flex items-center pl-3 pointer-events-none text-gray-500 bg-gray-100 rounded-l-full px-3 border border-r-0 border-gray-200">
            <span className="font-medium">+229</span>
            <span className="ml-1">01</span>
          </div>
          <input
            type="tel"
            id={name}
            name={name}
            placeholder={placeholder}
            {...rest}
            ref={ref}
            value={formatPhoneNumber(value)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const cleanValue = e.target.value.replace(/\D/g, "").slice(0, 8);
              const fullNumber = cleanValue ? `+22901${cleanValue}` : "";
              rest.onChange?.(fullNumber);
            }}
            maxLength={13}
            className={cn(
              "input !text-[17px] !pl-22",
              errorMessage ? "input-error" : "",
              className
            )}
          />
        </div>
        {errorMessage && <p className="input-error-message">{errorMessage}</p>}
      </div>
    );
  }
);

PhoneNumberField.displayName = "PhoneNumberField";

export default PhoneNumberField;
