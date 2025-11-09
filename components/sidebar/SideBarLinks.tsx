import { ROLES } from "@/utils/constants/users";
import {
  adminNavLinks,
  companyNavLinks,
  resellerNavLinks,
  userNavLinks,
  navLinksGuest,
} from "./LinksData";
import MoreButton from "./MoreButton";
import NavLinkItem from "./NavLinkItem";

interface SideBarLinksProps {
  pathname: string;
  userRole?: string | null;
  hideText?: boolean;
  user?: any;
}

export default function SideBarLinks({
  pathname,
  userRole,
  hideText = false,
  user,
}: SideBarLinksProps) {
  let navLinks = userNavLinks;
  if (!user) {
    navLinks = navLinksGuest;
  } else if (userRole === ROLES.ADMIN) {
    navLinks = adminNavLinks;
  } else if (userRole === ROLES.COMPANY) {
    navLinks = companyNavLinks;
  }

  return (
    <nav className="flex flex-col gap-1 px-3 mt-[3vh] max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
      <div className="flex flex-col gap-1 custom-scrollbar">
        {navLinks.map((link) => (
          <NavLinkItem
            key={link.label}
            link={link}
            isActive={pathname === link.href}
            hideText={hideText}
            user={user}
          />
        ))}
      </div>

      {/* {user && userRole !== ROLES.RESELLER && <MoreButton pathname={pathname} />} */}
    </nav>
  );
}
