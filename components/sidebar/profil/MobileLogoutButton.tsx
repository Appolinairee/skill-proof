"use client";
import { LogoutIcon } from "@/public/assets/icons/SideBarIcons";
import { useLogout } from "@/api/authServices";
import useUserStore from "@/store/userStore";
import Button from "@/components/base/button/Button";

const MobileLogoutButton = () => {
  const { mutate: logout, isPending } = useLogout();
  const user = useUserStore((state) => state.user);
  if (!user) return null;

  return (
    <Button
      onClick={() => logout({})}
      disabled={isPending}
      className="mobile:hidden border border-red-300 text-red-600 !flex gap-3 items-center justify-center mx-3 !w-fit !px-10 !py-3 mt-6"
      icon={<LogoutIcon className="w-5 h-5" />}
    >
      Déconnexion
    </Button>
  );
};

export default MobileLogoutButton;
