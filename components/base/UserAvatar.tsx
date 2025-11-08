import { cn } from "@/utils/utils";
import Image from "next/image";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeConfig = {
  xs: { container: "w-6 h-6", text: "text-xs" },
  sm: { container: "w-8 h-8", text: "text-sm" },
  md: { container: "w-9 h-9", text: "text-base" },
  lg: { container: "w-12 h-12", text: "text-lg" },
  xl: { container: "w-16 h-16", text: "text-xl" },
};

interface UserAvatarProps {
  user: { firstName?: string; lastName?: string; name?: string; email?: string; profilePicture?: Media | null; isCompany?: boolean };
  className?: string;
  size?: AvatarSize;
}

const UserAvatar = ({ user, className, size = "md" }: UserAvatarProps) => {
  const { container, text } = sizeConfig[size];

  const baseClasses = cn(
    "rounded-full select-none shrink-0",
    container,
    className
  );

  const profilePictureUrl = user.profilePicture?.url || null;

  if (profilePictureUrl) {
    return (
      <Image
        className={cn(
          baseClasses,
          "object-cover object-center",
          user.isCompany ? "ring-2 ring-primary" : ""
        )}
        src={profilePictureUrl}
        alt={user.firstName || user.name || "Utilisateur"}
        title={user.firstName || user.name || "Utilisateur"}
        loading="lazy"
        height={50}
        width={50}
        draggable={false}
      />
    );
  }

  const firstLetter = (user.firstName || user.name || "U").charAt(0).toUpperCase();
  // const bgClass = getAvatarColorFromEmail(user.email || user.firstName || user.name);

  return (
    <div
      className={cn(
        baseClasses,
        "flex items-center justify-center",
        "text-white font-medium",
        "leading-none bg-primary",
        text
      )}
      title={user.firstName || user.name || "Utilisateur"}
    >
      <span
        className="translate-y-[1px] mobile:translate-y-[2px]"
        style={{ display: "inline-block", lineHeight: 1 }}
      >
        {firstLetter}
      </span>
    </div>
  );
};

export default UserAvatar;
