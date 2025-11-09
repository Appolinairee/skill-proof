"use client";

import { useState } from "react";
import { cn } from "@/utils/utils";
import { DotsSquareIcon } from "@/public/assets/icons/SideBarIcons";
import NavLinkItem from "./NavLinkItem";
import { moreLinks } from "./LinksData";

export default function MoreButton({ pathname }: { pathname?: string }) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <>
      {isMoreOpen && <div className="border-t border-gray-200" />}

      {!isMoreOpen && (
        <button
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className={cn(
            `flex items-center gap-3 p-2 rounded-lg transition-colors group`,
            `hover:bg-gray-100 cursor-pointer mx-auto md:mx-0`
          )}
        >
          <DotsSquareIcon
            className={cn(
              "text-[15px] w-[22px] h-[22px] text-gray-700 transition-all duration-200",
              "group-hover:text-black",
              isMoreOpen && "rotate-180"
            )}
          />

          <p
            className={cn(
              "text-[15px] flex-c mt-[1px] text-gray-700 transition-colors duration-200",
              "group-hover:text-black",
              "!hidden md:!flex"
            )}
          >
            {isMoreOpen ? "Moins" : "Plus"}
          </p>
        </button>
      )}

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isMoreOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {moreLinks.map((link) => (
          <NavLinkItem
            key={link.href}
            link={link}
            isActive={pathname === link.href}
          />
        ))}
      </div>
    </>
  );
}
