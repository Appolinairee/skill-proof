import StatusBadge, { STATUS_MAPPERS } from "../base/StatusBadge";
import { IconType } from "react-icons";
import { cn } from "@/utils/utils";
import Image from "next/image";

const Card = ({
    title,
    subtitle,
    status,
    statusType,
    badge,
    primaryInfo,
    secondaryInfo,
    timestamp,
    icon: Icon,
    className = "",
    accentClassName = "bg-blue-50",
    cover,
}: {
    title: string;
    subtitle?: string;
    status?: string;
    statusType?: keyof typeof STATUS_MAPPERS;
    badge?: string;
    primaryInfo?: string;
    secondaryInfo?: string;
    timestamp?: string;
    icon?: IconType;
    className?: string;
    accentClassName?: string;
    cover?: string;
}) => {
    return (
        <div className={cn("relative p-1 rounded-[16px]", accentClassName)}>
            {cover && (
                <div className="mb-1">
                    <Image
                        src={cover}
                        alt={title}
                        width={200}
                        height={100}
                        className="w-full h-[110px] object-cover rounded-[16px] shadow-sm"
                    />
                </div>
            )}

            <div className={`rounded-[16px] border border-gray-200 py-3 px-4 w-full bg-white shadow-sm transition-all hover:shadow-md ${className}`}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                <Icon size={16} className="text-gray-600" />
                            </div>
                        )}

                        <div className="flex items-center gap-1">
                            <h3 className="font-semibold text-gray-900 text-xl">
                                {title}
                            </h3>
                            {subtitle && (
                                <span className="text-sm text-gray-500">
                                    {subtitle}
                                </span>
                            )}
                        </div>
                    </div>

                    {status && statusType && (
                        <StatusBadge
                            statusType={statusType}
                            statusValue={status}
                            className=""
                        />
                    )}
                </div>

                {primaryInfo && (
                    <p className="text-sm mb-2">
                        {primaryInfo}
                    </p>
                )}

                {badge && (
                    <p className="text-sm text-gray-600 mb-2">
                        {badge}
                    </p>
                )}

                {secondaryInfo && (
                    <p className="text-sm text-gray-600">
                        {secondaryInfo}
                    </p>
                )}
            </div>

            {timestamp && (
                <div className={`pt-[7px] text-center rounded-full text-xs font-medium text-gray-600`}>
                    {timestamp}
                </div>
            )}
        </div>
    );
};

export default Card;
