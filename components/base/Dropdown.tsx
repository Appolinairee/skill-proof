"use client";

import { useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import DropdownMenu from "./DropdownMenu";

interface DropdownOption {
    label: string;
    icon: React.ReactElement;
    onClick?: () => void;
}

interface DropdownProps {
    options: DropdownOption[];
    placeholder?: string;
    buttonClass?: string;
    menuClass?: string;
}

export default function Dropdown({
    options,
    placeholder = "Options",
    buttonClass = "",
    menuClass = "",
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
        <div className="relative w-auto">
            <button
                ref={buttonRef}
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-controls="dropdown-menu"
                className={`py-2 px-4 flex items-center justify-between w-full text-[15px] bg-white border border-dark/20 rounded-[12px] shadow-sm focus:border-primary ${buttonClass}`}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span>{placeholder}</span>
                <MdKeyboardArrowDown className={`text-dark/90 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`} />
            </button>

            <DropdownMenu
                options={options}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                menuClass={menuClass}
                anchorRef={buttonRef}
            />
        </div>
    );
}
