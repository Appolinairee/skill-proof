"use client";

import Image from "next/image";
import { useState } from "react";
import { BsThreeDotsVertical, BsChevronDown } from "react-icons/bs";
import useUserStore from "@/store/userStore";
import { useGetUser } from "@/api/userServices";
import { useGetCompany } from "@/api/company/companyAuthServices";
import { useGetOrder } from "@/api/orderServices";
import { cn } from "@/utils/utils";
import { getRoleLabel } from "@/utils/roleUtils";
import ProfileMenu from "./ProfileMenu";
import { ROLES } from "@/utils/constants/users";
import UserAvatar from "@/components/base/UserAvatar";

interface ProfileButtonProps {
  className?: string;
  isMinified?: boolean;
  isAuth?: boolean;
}

interface SharedProps {
  user: any;
  company: any;
  // can be a URL string or an object with url property (Media)
  profileImageSrc?: string | { url?: string } | undefined;
  profilMenuState: boolean;
  setProfilMenuState: (val: boolean) => void;
  className?: string;
}

export default function ProfileButton({
  className,
  isMinified = false,
  isAuth = false,
}: ProfileButtonProps) {
  useGetUser();
  useGetCompany();
  useGetOrder({ isCurrent: "true" });

  const user = useUserStore((state) => state.user);
  const [profilMenuState, setProfilMenuState] = useState(!isAuth && !user);
  const company = useUserStore((state) => state.company);

  const profileImageSrc =
    user?.roleType === ROLES.COMPANY || user?.roleType === ROLES.RESELLER
      ? company?.logo?.url
      : user?.profilePicture;

  const sharedProps: SharedProps = {
    user,
    company,
    profileImageSrc,
    profilMenuState,
    setProfilMenuState,
    className,
  };

  return isMinified ? (
    <MinifiedProfileButton {...sharedProps} />
  ) : (
    <FullProfileButton {...sharedProps} />
  );
}

const FullProfileButton = ({
  user,
  company,
  profileImageSrc,
  profilMenuState,
  setProfilMenuState,
  className,
}: SharedProps) => {
  return (
    <div
      className={cn("relative", className)}
      onClick={() => setProfilMenuState(!profilMenuState)}
    >
      <button
        className="flex items-center justify-between gap-2 bg-white rounded-full cursor-pointer transition-all mobile:py-1 md:py-2 md:pl-2 md:pr-2 border border-gray-300 md:border-gray-200 !w-full shadow-soft "
        aria-label="Profile"
      >
        <div className="flex items-center gap-3 mx-auto md:mx-0">
          <ProfilePicture src={profileImageSrc} />

          <div className="hidden md:flex flex-col !items-start whitespace-nowrap">
            <p className="font-semibold leading-tight max-w-[95px] truncate">
              {company
                ? company.name
                : user
                  ? `${user?.firstName} ${user?.lastName}`
                  : "Mode Visiteur"}
            </p>
            <span className="text-gray-700 leading-tight">
              {user ? getRoleLabel(user?.roleType) : "Visiteur"}
            </span>
          </div>
        </div>

        <div className="hidden md:block p-1 rounded-full transition-colors mr-2">
          <BsThreeDotsVertical className="text-gray-700 text-[19px]" />
        </div>
      </button>

      {profilMenuState && (
        <ProfileMenu setProfilState={setProfilMenuState} isMinified={false} />
      )}
    </div>
  );
};

const MinifiedProfileButton = ({
  profileImageSrc,
  profilMenuState,
  setProfilMenuState,
  className
}: SharedProps) => {
  return (
    <div
      className={cn("relative", className)}
      onClick={() => setProfilMenuState(!profilMenuState)}
    >
      <button
        className="flex items-center justify-center gap-1 bg-white rounded-full cursor-pointer transition-all  border border-gray-100 px-1 py-[3px] hover:bg-gray-50"
        aria-label="Profile"
      >
        <ProfilePicture src={profileImageSrc} isMinified={true} />
        <div className="p-1 rounded-full transition-colors">
          <BsChevronDown
            className={cn(
              "text-gray-700 text-sm transition duration-300",
              profilMenuState ? "rotate-180" : "rotate-0"
            )}
          />
        </div>
      </button>

      {profilMenuState && (
        <ProfileMenu setProfilState={setProfilMenuState} isMinified={true} />
      )}
    </div>
  );
};

const ProfilePicture = ({
  isMinified,
  src,
}: {
  isMinified?: boolean;
  src?: string | { url?: string };
}) => {
  const user = useUserStore((state) => state.user);
  const company = useUserStore((state) => state.company);

  // resolve src if it's a Media-like object
  const resolvedSrc =
    typeof src === "string" ? src : src && typeof src === "object" ? src.url : undefined;

  if (resolvedSrc || !user) {
    const imageSrc = resolvedSrc || "/assets/default-profile.jpeg";
    return (
      <div
        className={cn(
          "rounded-full overflow-hidden relative",
          isMinified
            ? "w-7.5 h-7.5"
            : "w-5 h-5 mobile:w-12 mobile:h-12 md:w-13 md:h-13"
        )}
      >
        <Image src={imageSrc} alt="Profile" fill className="object-cover" />
      </div>
    );
  }

  const avatarUser =
    user?.roleType === ROLES.COMPANY || user?.roleType === ROLES.RESELLER
      ? {
        name: company?.name || "Utilisateur",
        profilePicture: company?.logo || null,
        isCompany: true,
      }
      : {
        name: user ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim() : "Visiteur",
        profilePicture: user?.profilePicture || null,
        isCompany: false,
      };

  return <UserAvatar user={avatarUser} className="w-6 h-[23px] !text-[12px] mobile:w-10 mobile:h-10 mobile:!text-[17px] sm:w-11 sm:h-11 sm:!text-[25px] !m-0 !p-0" />;
};
