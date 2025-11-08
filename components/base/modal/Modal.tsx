import React from "react";
import useBodyScrollLock from "./useBodyScrollLock";
import { cn } from "@/utils/utils";

const Modal = ({
  isActive = false,
  setIsActive,
  children,
  className = "",
  containerClassName,
}: Modal) => {
  useBodyScrollLock(isActive);

  const handleCloseModal = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      setIsActive(false);
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/20 backdrop-blur-[8px] transition-all duration-300 ease-out z-20",
        isActive ? "opacity-100" : "opacity-0 pointer-events-none",
        containerClassName
      )}
      onClick={handleCloseModal}
    >
      <div
        className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl border border-gray-100 max-w-lg transition-all duration-300 ease-out overflow-hidden",
          isActive ? "scale-100 opacity-100" : "scale-95 opacity-0",
          "",
          className
        )}
      >
        <div className="max-h-[calc(100vh-20px)] h-full overflow-y-auto custom-scrollbar p-2 sm:p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
