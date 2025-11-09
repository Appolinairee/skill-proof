import { cn } from "@/utils/utils";
import Logo from "../global/Logo";
import ProfileButton from "./profil/ProfileButton";
import SideBarLinks from "./SideBarLinks";
import { ROLES } from "@/utils/constants/users";

interface SidebarProps {
  className?: string;
  userRole?: string | null;
  pathname?: string;
  user?: any;
}

export default function SideBar({
  className,
  userRole,
  pathname,
  user,
}: SidebarProps) {
  return (
    <div
      className={cn(
        "min-h-screen py-2 w-[70px] md:w-full md:px-[10%]",
        className
      )}
    >
      <Logo className="px-[10px]" />

      <SideBarLinks
        pathname={pathname || "/"}
        userRole={userRole}
        user={user}
      />

      {/* {(!userRole || userRole == ROLES.USER) && <CartButton />} */}

      <div className="absolute w-[80%] left-[10%] md:left-auto bottom-2 md:bottom-[4vh]">
        <ProfileButton className="" isAuth={Boolean(userRole)} />
      </div>
    </div>
  );
}
