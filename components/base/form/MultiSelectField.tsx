/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { cn } from "@/utils/utils";
import { formatMediaUrl } from "@/utils/media";

type MultiSelectFieldProps = {
  label: string;
  options: Option[];
  maxSelections?: number;
  value?: string[] | null;
  errorMessage?: string | null;
  onChange?: (values: string[]) => void;
  displayedNumber?: number;
};

const MultiSelectField = ({
  label,
  options,
  maxSelections = 8,
  value = [],
  errorMessage,
  onChange,
  displayedNumber,
}: MultiSelectFieldProps) => {
  const handleToggleOption = (optionValue: string): void => {
    if (value?.includes(optionValue)) {
      const newValues = value.filter((val) => val !== optionValue);
      onChange?.(newValues);
    } else if (value && value?.length < maxSelections) {
      const newValues = [...value, optionValue];
      onChange?.(newValues);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {value && value.length > 0 && (
          <span className="ml-2 text-sm text-gray-500">
            ({value.length}/{displayedNumber || maxSelections})
          </span>
        )}
      </label>

      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = value?.includes(option.value);
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleToggleOption(option.value)}
              disabled={Boolean(
                !isSelected && value && value.length >= maxSelections
              )}
              className={cn(
                "flex items-center gap-1 px-[6px] py-[7px] rounded-full border transition-all duration-200",
                "hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1",
                isSelected
                  ? "border-primary/80 bg-primary/5 focus:ring-primary/50"
                  : "border-gray-300 text-gray-700 focus:ring-gray-300",
                !isSelected && value && value.length >= maxSelections
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              )}
            >
              {Icon && <span className="w-5 h-5">{Icon}</span>}

              {option.image?.url && (
                <img
                  height={30}
                  width={30}
                  src={formatMediaUrl(option.image?.url)}
                  alt={option.label}
                  className="w-5 h-5"
                />
              )}
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>

      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default MultiSelectField;
