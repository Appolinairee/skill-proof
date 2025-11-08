"use client";
import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { NothingImageSrc } from "../base/EmptySection";
import SkeletonLoader from "../skeletons/MediaSkeletonLoader";

const ImageWithLoader = (props: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative w-fit h-fit">
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <SkeletonLoader className="w-full h-full" />
        </div>
      )}

      <Image
        {...props}
        alt={props.alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = NothingImageSrc;
        }}
        onContextMenu={handleContextMenu}
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${props.className || ""}`}
      />
    </div>
  );
};

export default ImageWithLoader;
