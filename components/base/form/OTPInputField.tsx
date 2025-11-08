"use client";

import React, { useState } from "react";
import Label from "./Label";
import { cn } from "@/utils/utils";
import OTPInput from "react-otp-input";

const OTPInputField = ({
  label,
  name,
  errorMessage,
  required = false,
  register,
  className,
  containerClassName,
  value,
  ...rest
}: OTPInputFieldProps) => {
  const [otp, setOtp] = useState(value);

  return (
    <div className="relative mb-3 !mx-auto">
      {label && (
        <Label
          title={label}
          htmlFor={name}
          required={required}
          className="ml-0"
        />
      )}

      <div className="relative">
        <OTPInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          inputType="number"
          renderSeparator={<span className="text-black/20">-</span>}
          renderInput={(props) => <input {...props} />}
          shouldAutoFocus
          inputStyle={`!w-10 !h-10 border border-gray-300 text-center text-lg rounded-[15px] focus:outline-none focus:ring-2 focus:ring-primary bg-white ${className}`}
          containerClassName={cn(
            "flex items-center gap-2 has-[:disabled]:opacity-50",
            containerClassName
          )}
          {...(register ? register(name) : {})}
          {...rest}
        />
      </div>

      {errorMessage && <p className="input-error-message">{errorMessage}</p>}
    </div>
  );
};

export default OTPInputField;
