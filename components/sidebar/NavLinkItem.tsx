import { cn } from "@/utils/utils";
import Link from "next/link";
import { ROUTES } from "@/utils/constants/routes";
import NotificationLink from "./NotificationLink";
import MessageLink from "./MessageLink";
import { NavLinkIcon } from "./NavLinkIcon";

export const getCountFromHref = (href: string, user: any) => {
  switch (href) {
    case ROUTES.NOTIFICATIONS:
      return user?.notificationCount;
    case ROUTES.CART:
      return user?.cartItemCount;
    case ROUTES.MESSAGES:
      return user?.unreadMessageCount;
    default:
      return 0;
  }
};

const NavLinkItem = ({
  link,
  isActive,
  hideText = false,
  user,
}: {
  link: NavLink;
  isActive: boolean;
  hideText?: boolean;
  user?: any;
}) => {
  const count = getCountFromHref(link.href, user);

  if (link.href === ROUTES.NOTIFICATIONS) {
    return (
      <NotificationLink
        link={link}
        isActive={isActive}
        hideText={hideText}
        count={count}
      />
    );
  }

  if (link.href === ROUTES.MESSAGES) {
    return (
      <MessageLink
        link={link}
        isActive={isActive}
        hideText={hideText}
        count={count}
      />
    );
  }

  return (
    <Link
      href={link.href}
      className={cn(
        `flex items-center justify-between p-2 rounded-[15px] transition-colors group`,
        isActive
          ? "bg-primary/10 md:bg-transparent"
          : "hover:bg-primary/10 md:hover:bg-transparent"
      )}
    >
      <div className="flex items-center gap-3 mx-auto md:mx-0">
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
    </Link>
  );
};

export default NavLinkItem;
