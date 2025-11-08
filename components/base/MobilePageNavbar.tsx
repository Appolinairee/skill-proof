import React from "react";
import BackButton from "@/components/base/BackButton";
import NotificationLink from "@/components/notification/NotificationLink";
import MobileSearch from "@/components/search/MobileSearch";

interface MobilePageNavbarProps {
  title: string;
  showNotification?: boolean;
  showSearch?: boolean;
  className?: string;
}

const MobilePageNavbar: React.FC<MobilePageNavbarProps> = ({
  title,
  showNotification = false,
  showSearch = false,
  className = "",
}) => {
  return (
    <div
      className={`mobile:hidden flex items-center justify-between gap-2 px-4 py-[10px] border-b border-gray-100 bg-white sticky top-0 z-10 ${className}`}
    >
      <div className="flex items-center gap-4 max-w-[calc(100%-50px)]">
        <BackButton className="!p-0 shadow-none *:text-black/80" />
        <span className="font-medium flex-1 text-[18px]">{title}</span>
      </div>
      <div className="flex items-center gap-7">
        {showNotification && <NotificationLink />}
        {showSearch && <MobileSearch />}
      </div>
    </div>
  );
};

export default MobilePageNavbar;
