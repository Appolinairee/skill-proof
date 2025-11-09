import { cn } from "@/utils/utils";
import { getIcon } from "./IconMap";

export function NavLinkIcon({
  link,
  isActive,
}: {
  link: NavLink;
  isActive: boolean;
}) {
  const iconClassName = cn(
    "text-[15px] w-6 h-6 text-gray-700 transition-colors duration-200",
    "group-hover:text-black",
    isActive && "!text-black"
  );

  const IconComponent = getIcon(isActive ? link.iconBold || link.icon : link.icon);
  if (!IconComponent) return null;

  return <IconComponent className={iconClassName} />;
}
