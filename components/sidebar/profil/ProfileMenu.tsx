import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserIcon,
  LoginIcon,
  LogoutIcon,
} from "@/public/assets/icons/SideBarIcons";
import useUserStore from "@/store/userStore";
import DropdownMenu from "@/components/base/DropdownMenu";
import { cn } from "@/utils/utils";
import { useLogout } from "@/api/authServices";
import { ROUTES } from "@/utils/constants/routes";
import { getRoleLabel } from "@/utils/roleUtils";

const ProfileMenu = ({
  setProfilState,
  isMinified,
}: {
  setProfilState: SetState;
  isMinified: boolean;
}) => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const company = useUserStore((state) => state.company);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { mutate: logout, isPending } = useLogout();

  const [profileUrl, setProfileUrl] = useState(ROUTES.PROFILE);

  useEffect(() => {
    setProfileUrl(company ? `/c/${company.slug}` : ROUTES.PROFILE);
  }, [company]);

  const UserLinks = [
    {
      label: "Profil",
      icon: <UserIcon className="w-[19px]" />,
      onClick: () => router.push(profileUrl),
    },
    // {
    //   label: "Paramètres",
    //   icon: <SettingIcon className="w-[19px]" />,
    //   onClick: () => router.push(ROUTES.SETTINGS),
    // },
    {
      label: "Déconnexion",
      icon: <LogoutIcon className="w-[19px]" />,
      onClick: () => logout({}),
      disabled: isPending,
    },
  ];

  const GuestLinks = [
    {
      label: "Inscription",
      icon: <UserIcon className="w-[19px]" />,
      onClick: () => router.push(ROUTES.REGISTER),
    },
    {
      label: "Connexion",
      icon: <LoginIcon className="w-[19px]" />,
      onClick: () => router.push(ROUTES.LOGIN),
    },
  ];

  const options = user ? UserLinks : GuestLinks;

  return (
    <>
      <DropdownMenu
        options={options}
        isOpen={true}
        onClose={() => setProfilState(false)}
        menuClass={cn(
          "!text-[20px] shadow-none shadow-soft !z-30",
          isMinified
            ? "!w-fit -left-full top-[100%]"
            : "top-auto bottom-full left-0 right-0 mb-1"
        )}
        anchorRef={buttonRef}
        header={
          <div className="md:hidden px-1 border-b border-gray-100 text-left">
            <div className="font-medium text-base text-gray-900 truncate">
              {user
                ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                  user?.email ||
                  "Utilisateur"
                : "Mode Visiteur"}
            </div>

            {user && (
              <div className="text-xs text-gray-500 truncate">
                {user?.email || ""} ,{" "}
                {user ? getRoleLabel(user?.roleType) : "Visiteur"}
              </div>
            )}
          </div>
        }
      />
    </>
  );
};

export default ProfileMenu;
