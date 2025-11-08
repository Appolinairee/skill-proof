"use client";

import React, { useState, useEffect } from "react";
import Label from "./Label";
import { cn } from "@/utils/utils";
import { formatMediaUrl } from "@/utils/media";
import { ImageIcon, VideoIcon } from "@/public/assets/icons/icons";
import { MediaPreviewGrid } from "@/components/company/medias/MediaPreviewGrid";
import { MediaType } from "@/utils/constants/medias";

type MediaFile = File | string | null;

interface MediaUploadFieldProps {
  label?: string;
  name: string;
  errorMessage?: string | null;
  required?: boolean;
  onChange?: (files: MediaFile[]) => void;
  value?: MediaFile[];
  icon?: React.ReactNode;
  accept?: "all" | "image" | "video";
  multiple?: boolean;
  maxFiles?: number;
}

const MediaUploadField = React.forwardRef<
  HTMLInputElement,
  MediaUploadFieldProps
>(
  (
    {
      label,
      name,
      errorMessage,
      required,
      onChange,
      value,
      icon,
      accept = "all",
      multiple = true,
    },
    ref
  ) => {
    const [mediaItems, setMediaItems] = useState<any[]>([]);

    const getAcceptString = () => {
      if (accept === "image") return "image/*";
      if (accept === "video") return "video/*";
      return "image/*,video/*";
    };

    useEffect(() => {
      if (!Array.isArray(value)) return;

      const newItems = value.map((item, index) => {
        const isFile = item instanceof File;
        const isImage = isFile
          ? item.type.startsWith("image/")
          : typeof item === "string";

        return {
          id: `media-${index}`,
          file: item,
          type: isImage ? MediaType.IMAGE : MediaType.VIDEO,
          preview: isFile
            ? URL.createObjectURL(item)
            : formatMediaUrl(item as string),
        };
      });

      if (newItems.length !== mediaItems.length) {
        setMediaItems(newItems);
      }
    }, [value, mediaItems.length]);

    useEffect(() => {
      return () => {
        mediaItems.forEach((item) => {
          if (item.file instanceof File && item.preview) {
            URL.revokeObjectURL(item.preview);
          }
        });
      };
    }, [mediaItems]);

    const validateFileSize = (
      file: File
    ): { valid: boolean; message: string } => {
      if (file.type.startsWith("image/")) {
        const maxImageSize = 5 * 1024 * 1024; // 5 Mo
        if (file.size > maxImageSize) {
          return {
            valid: false,
            message: `Image "${file.name}" trop lourde (${formatFileSize(file.size)}). Taille maximum autorisée : ${formatFileSize(maxImageSize)}`,
          };
        }
      } else if (file.type.startsWith("video/")) {
        const maxVideoSize = 15 * 1024 * 1024; // 15 Mo
        if (file.size > maxVideoSize) {
          return {
            valid: false,
            message: `Vidéo "${file.name}" trop lourde (${formatFileSize(file.size)}). Taille maximum autorisée : ${formatFileSize(maxVideoSize)}`,
          };
        }
      }
      return { valid: true, message: "" };
    };

    const formatFileSize = (bytes: number): string => {
      if (bytes < 1024) return bytes + " octets";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " Ko";
      return (bytes / (1024 * 1024)).toFixed(2) + " Mo";
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const existingImages = mediaItems.filter(
        (item) => item.type === MediaType.IMAGE
      );
      const existingVideos = mediaItems.filter(
        (item) => item.type === MediaType.VIDEO
      );

      let newImagesCount = existingImages.length;
      let newVideosCount = existingVideos.length;

      const newMediaItems = [...mediaItems];
      const newFiles: File[] = [];
      let hasError = false;

      Array.from(files).forEach((file) => {
        const isImage = file.type.startsWith("image/");
        const mediaType: MediaType = isImage
          ? MediaType.IMAGE
          : MediaType.VIDEO;

        if (isImage && newImagesCount >= 5) return;
        if (!isImage && newVideosCount >= 1) return;

        const sizeValidation = validateFileSize(file);
        if (!sizeValidation.valid) {
          alert(sizeValidation.message);
          hasError = true;
          return;
        }

        if (isImage) newImagesCount++;
        else newVideosCount++;

        newFiles.push(file);

        newMediaItems.push({
          id: `media-${Date.now()}-${file.name}`,
          file,
          type: mediaType,
          preview: URL.createObjectURL(file),
        });
      });

      if (hasError) {
        event.target.value = "";
        return;
      }

      setMediaItems(newMediaItems);

      if (onChange) {
        const allFiles = [...mediaItems.map((item) => item.file), ...newFiles];
        onChange(allFiles);
      }

      event.target.value = "";
    };

    const handleRemove = (id: string) => {
      const mediaToRemove = mediaItems.find((item) => item.id === id);

      if (mediaToRemove && mediaToRemove.file instanceof File) {
        URL.revokeObjectURL(mediaToRemove.preview);
      }

      const updatedItems = mediaItems.filter((item) => item.id !== id);
      setMediaItems(updatedItems);

      if (onChange) {
        const allFiles = updatedItems.map((item) => item.file);
        onChange(allFiles);
      }
    };

    return (
      <div className="mb-6">
        <MediaPreviewGrid items={mediaItems} onRemove={handleRemove} />

        {label && (
          <Label title={label} htmlFor={name} icon={icon} required={required} />
        )}

        <div
          className={cn(
            "relative border-2 border-dashed rounded-[12px] transition-colors p-4 mt-3 flex items-center space-x-4 bg-white",
            errorMessage
              ? "border-red-500"
              : "border-gray-300 hover:border-primary"
          )}
        >
          <label className="cursor-pointer group flex items-center space-x-4">
            <input
              ref={ref}
              type="file"
              accept={getAcceptString()}
              className="hidden"
              onChange={handleFileChange}
              name={name}
              multiple={multiple}
            />

            <div className="flex items-center flex-wrap space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <ImageIcon className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
              </div>

              {accept !== "image" && (
                <>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <VideoIcon className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col">
              <p className="font-medium text-primary">
                Cliquez pour ajouter{" "}
                {accept === "image"
                  ? "une image"
                  : accept === "video"
                    ? "une vidéo"
                    : "un média"}
              </p>

              <p className="text-xs text-gray-500">
                {accept === "all" && "PNG, JPG, MP4, WEBM, ..."}
                {accept === "image" && "PNG, JPG, GIF (max. 5 Mo)"}
                {accept === "video" && "MP4, WEBM (max. 50 Mo)"}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                {accept === "image" ? (
                  <>
                    {
                      mediaItems.filter((item) => item.type === MediaType.IMAGE)
                        .length
                    }
                    /5 images
                  </>
                ) : accept === "video" ? (
                  <>
                    {
                      mediaItems.filter((item) => item.type === MediaType.VIDEO)
                        .length
                    }
                    /1 vidéo
                  </>
                ) : (
                  <>
                    {
                      mediaItems.filter((item) => item.type === MediaType.IMAGE)
                        .length
                    }
                    /5 images,{" "}
                    {
                      mediaItems.filter((item) => item.type === MediaType.VIDEO)
                        .length
                    }
                    /1 vidéo
                  </>
                )}
              </p>
            </div>
          </label>
        </div>

        {errorMessage && (
          <p className="mt-1 text-sm text-red-500" aria-live="polite">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

MediaUploadField.displayName = "MediaUploadField";

export default MediaUploadField;
