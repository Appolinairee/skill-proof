"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/public/assets/icons/icons";

interface BackButtonProps {
  className?: string;
  onClick?: () => void;
}

const BackButton = ({ className = "", onClick }: BackButtonProps) => {
  const router = useRouter();
  const defaultClassName =
    "p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all ";

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${className} ${defaultClassName}`}
    >
      <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
  );
};

export default BackButton;
