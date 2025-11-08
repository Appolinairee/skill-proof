"use client";

import { cn } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";

interface DropdownOption {
  label: string;
  icon: React.ReactElement;
  onClick?: () => void;
}

interface DropdownMenuProps {
  options: DropdownOption[];
  isOpen: boolean;
  onClose: () => void;
  menuClass?: string;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  header?: React.ReactNode;
}

export default function DropdownMenu({
  options,
  isOpen,
  onClose,
  menuClass = "",
  anchorRef,
  header,
}: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !anchorRef.current?.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setActiveIndex((prev) => (prev + 1) % options.length);
          break;
        case "ArrowUp":
          event.preventDefault();
          setActiveIndex(
            (prev) => (prev - 1 + options.length) % options.length
          );
          break;
        case "Enter":
          if (activeIndex >= 0) {
            options[activeIndex].onClick?.();
            onClose();
          }
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, options, activeIndex, onClose, anchorRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      id="dropdown-menu"
      role="menu"
      className={cn(
        `absolute top-[105%] left-0 mt-2 bg-white border border-gray-200 rounded-[20px] shadow-lg p-2 py-1 w-auto min-w-[180px] ${menuClass}`
      )}
    >
      {header && <div className="mb-1">{header}</div>}
      {options.map((option, index) => (
        <button
          key={index}
          role="menuitem"
          onClick={() => {
            option.onClick?.();
            onClose();
          }}
          className={`flex items-center gap-2 px-3 py-2 w-full text-[14px] hover:bg-gray-100 rounded-[10px] transition-all cursor-pointer ${
            index === activeIndex ? "bg-gray-100" : ""
          }`}
        >
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
