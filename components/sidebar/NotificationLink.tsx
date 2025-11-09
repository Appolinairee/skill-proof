"use client";

import useNotificationStore from "@/store/notificationStore";
import { cn } from "@/utils/utils";
import { NavLinkIcon } from "./NavLinkIcon";

const NotificationLink = ({
  link,
  isActive,
  hideText = false,
  count,
}: {
  link: NavLink;
  isActive: boolean;
  hideText?: boolean;
  count?: number;
}) => {
  const { toggleNotification } = useNotificationStore();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleNotification();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        `flex items-center justify-between p-2 rounded-[15px] transition-colors group w-full`,
        isActive
          ? "bg-primary/10 md:bg-transparent"
          : "hover:bg-primary/10 md:hover:bg-transparent"
      )}
    >
      <div className="flex items-center gap-3 mx-auto md:mx-0 cursor-pointer">
        <div className="relative">
          <NavLinkIcon link={link} isActive={isActive} />

          {count !== undefined && Number(count) > 0 && (
            <div className="icon-badge">
              <span className="pt-[1px]">{count}</span>
            </div>
          )}
        </div>

        {!hideText && (
          <p
            className={cn(
              "flex-c mt-[1px] text-gray-700 transition-colors duration-200 text-[18px]",
              "group-hover:text-black",
              "!hidden md:!flex",
              isActive && "!text-black font-medium"
            )}
          >
            {link.label}
          </p>
        )}
      </div>
    </button>
  );
};

export default NotificationLink;
