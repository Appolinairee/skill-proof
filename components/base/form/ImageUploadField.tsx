"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import Label from "./Label";
import { cn } from "@/utils/utils";
import { formatMediaUrl } from "@/utils/media";
import { ImageIcon } from "@/public/assets/icons/icons";

const IMAGE_CONFIG = {
  maxSize: 5 * 1024 * 1024,
  acceptedFormats: "image/*",
  dimensions: {
    preview: {
      width: 24,
      height: 24,
    },
    icon: {
      width: 12,
      height: 12,
    },
  },
} as const;

interface ImagePreviewProps {
  src: string;
  onRemove: (e: React.MouseEvent) => void;
}

const ImagePreview = ({ src, onRemove }: ImagePreviewProps) => (
  <div className="absolute right-0 h-full border border-gray-200 rounded-lg max-w-[200px] w-[40%]">
    <Image
      src={src}
      alt="Logo preview"
      fill
      className="object-contain rounded"
    />
    <button
      type="button"
      onClick={onRemove}
      className="absolute -top-2 -right-1 bg-red-500 text-white rounded-full p-[2px] hover:bg-red-600 transition-colors shadow-sm"
      aria-label="Remove image"
    >
      <FiX size={12} />
    </button>
  </div>
);

interface UploadPromptProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  preview: string | null;
  onRemove: (e: React.MouseEvent) => void;
}

const UploadPrompt = React.forwardRef<
  HTMLInputElement,
  Omit<UploadPromptProps, "ref">
>(({ onChange, name, preview, onRemove }, ref) => (
  <label className="block cursor-pointer group items-center">
    {preview && <ImagePreview src={preview} onRemove={onRemove} />}

    <input
      type="file"
      accept={IMAGE_CONFIG.acceptedFormats}
      className="hidden"
      onChange={onChange}
      name={name}
      ref={ref as React.Ref<HTMLInputElement>}
    />

    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 active:bg-gray-100 transition-colors">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary/10">
        <ImageIcon className="w-6 h-6 text-gray-600 group-hover:text-primary" />
      </div>
      <div className="text-left">
        <span className="font-medium text-primary block text-sm">
          Cliquez ici
        </span>
        <span className="text-xs text-gray-500">PNG, JPG (max 5MB)</span>
      </div>
    </div>
  </label>
));
UploadPrompt.displayName = "UploadPrompt";

const ImageUploadField = React.forwardRef<
  HTMLInputElement,
  ImageUploadFieldProps
>(({ label, name, errorMessage, required, onChange, value, icon }, ref) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (typeof value === "string" && value) {
      const fullUrl = formatMediaUrl(value);
      setPreview(fullUrl ?? null);
      setFile(null);
    } else if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      setFile(value);
    } else if (value === null || value === undefined) {
      setPreview(null);
      setFile(null);
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (preview && file) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const newFile = files[0];

    setFile(newFile);
    const objectUrl = URL.createObjectURL(newFile);
    setPreview(objectUrl);
    onChange?.(newFile);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (preview && file) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);
    setFile(null);

    onChange?.(null);
  };

  return (
    <div className="mb-4">
      {label && (
        <Label title={label} htmlFor={name} icon={icon} required={required} />
      )}

      <div
        className={cn(
          "relative border-2 border-dashed rounded-[10px] transition-colors",
          preview
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary",
          errorMessage ? "border-red-500" : ""
        )}
      >
        <UploadPrompt
          onChange={handleFileChange}
          name={name}
          preview={preview}
          onRemove={handleRemove}
          ref={ref}
        />
      </div>

      {errorMessage && (
        <p className="mt-1 text-sm text-red-500" aria-live="polite">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

ImageUploadField.displayName = "ImageUploadField";

export default ImageUploadField;
