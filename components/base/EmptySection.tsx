import { cn } from "@/utils/utils";
import Image from "next/image";

export const NothingImageSrc = "/assets/nothing.svg";

const EmptySection = ({
  text,
  children,
  className,
  imageClassName,
  imageUrl
}: NothingToDisplay) => {
  return (
    <div className={cn("my-5", className)}>
      <Image
        className={cn(
          "w-auto mx-auto h-[100%]",
          imageClassName
        )}
        src={imageUrl || NothingImageSrc}
        width={500}
        height={500}
        alt={text || "Indisponibilité de la section"}
      />

      <p className="mt-6 text-center font-medium">{text}</p>

      {children}
    </div>
  );
};

export default EmptySection;
