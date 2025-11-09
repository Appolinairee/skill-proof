import {
    CategoryIcon,
    HomeIcon,
    NotificationIcon,
    NotificationBoldIcon,
    MessageIcon,
    MessageBoldIcon,
    CategoryBoldIcon,
    ShoppingCartIcon,
    ScanBarcodeIcon,
} from "@/public/assets/icons/icons";

import {
    MessageQuestionIcon,
    MessageQuestionBoldIcon,
    HomeBoldIcon,
    ShopBoldIcon,
    ShopIcon,
    ShoppingCartBoldIcon,
    UserBoldIcon,
    UserIcon,
    WalletIcon,
    WalletMinusIcon,
    WalletAddIcon,
    BuildingsBoldIcon,
    BuildingsIcon,
    AddSquareIcon,
    LoginIcon,
    BoxBoldIcon,
    BoxIcon,
    WalletBoldIcon,
} from "@/public/assets/icons/SideBarIcons";

import {
    ArchiveTickBoldIcon,
    ArchiveTickIcon
} from "@/public/assets/icons/interactionsIcons";
import { AffiliationIcon, MoneysIcon, TagIcon } from "@/public/assets/icons/WalletIcons";

export const iconMap: Record<string, React.ComponentType<any>> = {
    HomeIcon,
    HomeBoldIcon,
    NotificationIcon,
    NotificationBoldIcon,
    CategoryIcon,
    CategoryBoldIcon,
    WalletIcon,
    WalletBoldIcon,
    BuildingsIcon,
    BuildingsBoldIcon,
    ArchiveTickIcon,
    ArchiveTickBoldIcon,
    MessageIcon,
    MessageBoldIcon,
    ShoppingCartIcon,
    ShoppingCartBoldIcon,
    AddSquareIcon,
    ShopIcon,
    ShopBoldIcon,
    UserIcon,
    UserBoldIcon,
    WalletMinusIcon,
    WalletAddIcon,
    MessageQuestionIcon,
    MessageQuestionBoldIcon,
    MoneysIcon,
    AffiliationIcon,
    LoginIcon,
    TagIcon,
    ScanBarcodeIcon,
    BoxIcon,
    BoxBoldIcon
};

export const getIcon = (iconName: string | React.ComponentType<any>) => {
    if (typeof iconName === "string") {
        return iconMap[iconName];
    }
    return iconName;
};
