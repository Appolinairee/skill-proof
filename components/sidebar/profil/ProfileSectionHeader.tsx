import Link from "next/link";
import React from "react";
import ModalTitle from "@/components/base/modal/ModalTitle";
import { BuildingsIcon } from "@/public/assets/icons/SideBarIcons";

interface SectionHeaderProps {
  title: string;
  buttonLabel: string;
  buttonHref: string;
  icon?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
}

const ProfileSectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  buttonLabel,
  buttonHref,
  icon = <BuildingsIcon />,
  className = "",
  buttonClassName = "",
}) => (
  <div
    className={`flex items-center justify-between mb-3 md:mb-6 ${className}`}
  >
    <div className="block xs:hidden">
      <h3 className="text-[17px] font-medium">{title}</h3>
    </div>

    <div className="hidden xs:block">
      <ModalTitle title={title} icon={icon} className="!mb-0" />
    </div>

    <Link
      href={buttonHref}
      className={`border bg-white border-gray-300 rounded-full px-2 py-1 text-sm md:!px-6  xs:!py-2 md:text-[16px] ${buttonClassName}`}
    >
      {buttonLabel}
    </Link>
  </div>
);

export default ProfileSectionHeader;
