import React from "react";
import Link from "next/link";
import { cn } from "@/utils/utils";
import Image from "next/image";

const Logo = ({
  minified = false,
  className,
}: {
  minified?: boolean;
  className?: string;
}) => {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex gap-2 items-center justify-center pt-[7px] pb-[5px] text-[20px]",
        minified ? "bg-node" : "bg-transparent !rounded-[17px]",
        className
      )}
    >
      <Image
        src={minified ? "/assets/logo-mini.png" : "/assets/logo.png"}
        alt="Logo Shopinx"
        width={minified ? 60 : 120}
        height={60}
        className={cn(
          "w-auto",
          minified
            ? "h-[45px]"
            : "h-[45px] mobile:h-[40px] -translate-x-[7px] mobile:translate-x-0"
        )}
      />
      {/* {!minified && <p className="translate-y-[1.5px]">Eleg</p>} */}
    </Link>
  );
};

export default Logo;
