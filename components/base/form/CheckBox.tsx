"use client";

import { cn } from "@/utils/utils";
import { useState } from "react";

type CheckboxProps = {
  label: string;
  isChecked?: boolean;
  onClick: (checked: boolean) => void;
  className?: string;
  color?: "primary" | "secondary";
  disabled?: boolean;
};

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  isChecked = false,
  onClick,
  className = "",
  color = "primary",
  disabled = false,
}) => {
  const [checked, setChecked] = useState(isChecked);

  const handleCheckboxChange = () => {
    if (disabled) return;
    onClick(!checked);
    setChecked(!checked);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-start cursor-pointer !w-fit gap-1",
        className,
        {
          "opacity-50 cursor-not-allowed": disabled,
        }
      )}
      onClick={handleCheckboxChange}
    >
      <span
        className={`w-[15px] h-[14px] rounded-[5px] border ${
          color === "primary" ? "border-primary" : "border-secondary"
        } transition-all ${
          checked
            ? color === "primary"
              ? "border-0 bg-primary/95"
              : "bg-secondary border-0"
            : ""
        }`}
      ></span>

      <p className={`w-[90%] ${checked ? "font-medium" : ""}`}>{label}</p>
    </div>
  );
};

export default Checkbox;
