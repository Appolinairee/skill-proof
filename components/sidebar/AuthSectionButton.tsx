"use client";

import { LoginIcon, UserIcon } from "@/public/assets/icons/SideBarIcons";
import { ROUTES } from "@/utils/constants/routes";
import { cn } from "@/utils/utils";
import Link from "next/link";

interface AuthLinkProps {
    href: string;
    label: string;
    icon: any;
    isActive?: boolean;
    onClick?: (e: React.MouseEvent) => void;
}

const AuthLinkItem = ({
    href,
    label,
    icon: IconComponent,
    isActive = false,
    onClick
}: AuthLinkProps) => {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                `flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-100 rounded-[10px] transition-all cursor-pointer text-[15px]`, isActive ? "bg-secondary/10 bg-gradient-to-r from-primary/10 via-primary/5 to-white border border-primary/10" : ""
            )}
        >
            <IconComponent
                className={cn("w-5 h-5")}
            />
            {label}
        </Link >
    );
};

interface AuthSectionProps {
    className?: string;
    onLoginClick?: (e: React.MouseEvent) => void;
    onRegisterClick?: (e: React.MouseEvent) => void;
}

export default function AuthSection({
    className,
    onLoginClick,
    onRegisterClick
}: AuthSectionProps) {
    return (
        <div className={cn("!text-[20px] shadow-none shadow-soft rounded-[20px] border border-gray-100 p-2 bg-white", className)}>
            <AuthLinkItem
                href={ROUTES.REGISTER}
                label="Inscription"
                icon={UserIcon}
                isActive={true}
                onClick={onRegisterClick}
            />

            <AuthLinkItem
                href={ROUTES.LOGIN}
                label="Connexion"
                icon={LoginIcon}
                onClick={onLoginClick}
            />
        </div>
    );
}
