"use client";

import React, { ReactNode, useState, useRef, useEffect } from "react";
import { cn } from "@/utils/utils";

interface InfoMessageProps {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  variant?: "info" | "warning" | "success" | "error";
  actionText?: string;
  modalContent?: ReactNode;
}

const InfoMessage = ({
  icon,
  children,
  className = "",
  iconClassName = "",
  textClassName = "",
  variant = "info",
  actionText,
  modalContent,
}: InfoMessageProps) => {
  const [showModal, setShowModal] = useState(false);
  const actionBtnRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!showModal) return;
      const target = e.target as Node;
      // if click is outside modal and outside the action button, close modal
      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        actionBtnRef.current &&
        !actionBtnRef.current.contains(target)
      ) {
        setShowModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  const variantStyles = {
    info: "text-blue-600 bg-blue-50",
    warning: "text-amber-600 bg-amber-50",
    success: "text-green-600 bg-green-50",
    error: "text-red-600 bg-red-50",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-2 text-sm p-2 rounded-md relative",
        variantStyles[variant],
        className
      )}
    >
      {icon && (
        <span className={cn("w-4 h-4 text-[16px] mt-0.5 flex-shrink-0", iconClassName)}>
          {icon}
        </span>
      )}
      <div className={cn("text-sm ellipsis flex-1 relative z-0 overflow-visible ", textClassName)}>
        {children}
        <div>
          {actionText && modalContent && (
            <button
              ref={actionBtnRef}
              onClick={() => setShowModal(!showModal)}
              className="px-1 cursor-pointer absolute bottom-[4px] h-[14px] right-0 bg-gray-200 rounded-sm shadow text-[13px] hover:no-underline"
            >
              ... {actionText}
            </button>
          )}
        </div>
      </div>

      {showModal && modalContent && (
        <div
          ref={modalRef}
          className={cn(
            "absolute bottom-8 right-0 bg-white rounded-[15px] border border-gray-200 shadow-soft p-2 py-1 w-full max-h-[80px] overflow-hidden"
          )}
        >
          {modalContent}
        </div>
      )}
    </div>
  );
};

export default InfoMessage;
