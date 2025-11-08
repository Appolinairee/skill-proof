// Import des configurations de statut centralisées
import { UserStatus, userStatusConfig } from "@/utils/constants/users";
import {
  ProductStatus,
  ProductAvailabilityStatus,
  productStatusConfig,
  productAvailabilityStatusConfig
} from "@/utils/constants/products";
import {
  OrderStatus,
  OrderPaymentStatus,
  DeliveryStatus,
  orderStatusConfig,
  orderPaymentStatusConfig,
  deliveryStatusConfig
} from "@/utils/constants/orders";
import {
  PaymentStatus,
  paymentStatusConfig
} from "@/utils/constants/payments";

import {
  WithdrawalStatus,
  withdrawalStatusConfig
} from "@/utils/constants/withdrawals";
import {
  MessageStatus,
  messageStatusConfig
} from "@/utils/constants/messages";
import {
  CompanyStatus,
  companyStatusConfig
} from "@/utils/constants/companies";
import {
  CategoryStatus,
  categoryStatusConfig
} from "@/utils/constants/categories";
import { TransactionType, transactionTypeConfig } from "@/utils/constants/transactions";

type StatusValue = -1 | 0 | 1 | 2;

export interface StatusConfig {
  value: StatusValue;
  label: string;
  color: string;
}

export const STATUS_MAPPERS = {
  userStatus: userStatusConfig as Record<UserStatus, StatusConfig>,
  productStatus: productStatusConfig as Record<ProductStatus, StatusConfig>,
  availabilityStatus: productAvailabilityStatusConfig as Record<ProductAvailabilityStatus, StatusConfig>,
  orderStatus: orderStatusConfig as Record<OrderStatus, StatusConfig>,
  orderPaymentStatus: orderPaymentStatusConfig as Record<OrderPaymentStatus, StatusConfig>,
  deliveryStatus: deliveryStatusConfig as Record<DeliveryStatus, StatusConfig>,
  paymentStatus: paymentStatusConfig as Record<PaymentStatus, StatusConfig>,
  withdrawalStatus: withdrawalStatusConfig as Record<WithdrawalStatus, StatusConfig>,
  messageStatus: messageStatusConfig as Record<MessageStatus, StatusConfig>,
  companyStatus: companyStatusConfig as Record<CompanyStatus, StatusConfig>,
  categoryStatus: categoryStatusConfig as Record<CategoryStatus, StatusConfig>,
  transactionType: transactionTypeConfig as Record<TransactionType, StatusConfig>,

  paymentBooleanStatus: {
    true: { value: 1, label: "Payé", color: "bg-green-100 text-green-700" },
    false: { value: -1, label: "À payer", color: "bg-red-100 text-red-700" },
  },

  booleanStatus: {
    true: { value: 1, label: "Oui", color: "bg-green-100 text-green-700" },
    false: { value: 0, label: "Non", color: "bg-red-100 text-red-700" },
  },

  activeInactiveStatus: {
    true: { value: 1, label: "Actif", color: "bg-green-100 text-green-700" },
    false: { value: 0, label: "Inactif", color: "bg-gray-100 text-gray-700" },
  },

  // Alias pour compatibilité (à déprécier progressivement)
  statusBoolean: {
    true: { value: 1, label: "Actif", color: "bg-green-100 text-green-700" },
    false: { value: 0, label: "Inactif", color: "bg-gray-100 text-gray-700" },
  },

  activeStatus: {
    true: { value: 1, label: "Actif", color: "bg-green-100 text-green-700" },
    false: { value: 0, label: "Inactif", color: "bg-gray-100 text-gray-700" },
  },

  enabledStatus: {
    true: { value: 1, label: "Activé", color: "bg-green-100 text-green-700" },
    false: { value: 0, label: "Désactivé", color: "bg-gray-100 text-gray-700" },
  },

  verifiedStatus: {
    true: { value: 1, label: "Vérifié", color: "bg-green-100 text-green-700" },
    false: { value: 0, label: "Non vérifié", color: "bg-gray-100 text-gray-700" },
  },

  // Statut par défaut pour les valeurs numériques
  defaultStatus: {
    1: { value: 1, label: "Actif", color: "bg-green-100 text-green-700" },
    0: { value: 0, label: "Inactif", color: "bg-gray-100 text-gray-700" },
    [-1]: { value: -1, label: "Supprimé", color: "bg-red-100 text-red-700" },
  },

  // Alias pour les statuts de paiement (compatibilité ascendante)
  paymentStatusLegacy: {
    [PaymentStatus.pending]: paymentStatusConfig[PaymentStatus.pending],
    [PaymentStatus.approved]: paymentStatusConfig[PaymentStatus.approved],
    [PaymentStatus.canceled]: paymentStatusConfig[PaymentStatus.canceled],
    [PaymentStatus.expired]: paymentStatusConfig[PaymentStatus.expired],
    [PaymentStatus.failed]: paymentStatusConfig[PaymentStatus.failed]
  },

  // Mappage générique pour les valeurs numériques
  generic: {
    "-1": { value: -1, label: "Inactif", color: "bg-red-100 text-red-700" },
    "0": { value: 0, label: "En attente", color: "bg-orange-100 text-orange-700" },
    "1": { value: 1, label: "Actif", color: "bg-green-100 text-green-700" },
    "2": { value: 2, label: "Complété", color: "bg-blue-100 text-blue-700" },
  }
} as const;

interface StatusBadgeProps {
  statusType?: keyof typeof STATUS_MAPPERS;
  statusValue?:
  | ((typeof STATUS_MAPPERS)["productStatus"] extends Record<infer K, any>
    ? K
    : never)
  | ((typeof STATUS_MAPPERS)["availabilityStatus"] extends Record<
    infer K,
    any
  >
    ? K
    : never)
  | ((typeof STATUS_MAPPERS)["paymentBooleanStatus"] extends Record<
    infer K,
    any
  >
    ? K
    : never)
  | ((typeof STATUS_MAPPERS)["orderStatus"] extends Record<infer K, any>
    ? K
    : never)
  | ((typeof STATUS_MAPPERS)["orderPaymentStatus"] extends Record<
    infer K,
    any
  >
    ? K
    : never)
  | ((typeof STATUS_MAPPERS)["deliveryStatus"] extends Record<infer K, any>
    ? K
    : never)
  | ((typeof STATUS_MAPPERS)["paymentStatus"] extends Record<infer K, any>
    ? K
    : never)
  | ((typeof STATUS_MAPPERS)["withdrawalStatus"] extends Record<infer K, any>
    ? K
    : never)
  | ((typeof STATUS_MAPPERS)["transactionType"] extends Record<infer K, any>
    ? K
    : never)
  | boolean
  | StatusValue
  | string;

  mapper?: Record<string | number, StatusConfig>;

  value?: StatusValue;
  label?: string;
  type?: "success" | "error" | "warning" | "info";
  className?: string;
}

const StatusBadge = ({
  statusType,
  statusValue,
  mapper,
  value,
  label,
  type,
  className = "",
}: StatusBadgeProps) => {
  let config: StatusConfig | null = null;

  if (statusType && statusValue !== undefined) {
    const selectedMapper = STATUS_MAPPERS[statusType];
    const valueStr =
      typeof statusValue === "boolean"
        ? statusValue.toString()
        : String(statusValue);
    config = selectedMapper?.[valueStr as keyof typeof selectedMapper] || null;
  } else if (mapper && statusValue !== undefined) {
    config = mapper[statusValue.toString()] || null;
  } else if (value !== undefined) {
    config = STATUS_MAPPERS.generic[value] || {
      value,
      label: `Statut ${value}`,
      color: "bg-gray-100 text-gray-700",
    };
  } else if (label !== undefined) {
    const colorMap = {
      success: "bg-green-100 text-green-700",
      error: "bg-red-100 text-red-700",
      warning: "bg-orange-100 text-orange-700",
      info: "bg-blue-100 text-blue-700",
    };
    config = {
      value: 0 as StatusValue,
      label,
      color: type ? colorMap[type] : "bg-gray-100 text-gray-700",
    };
  }

  if (!config) {
    config = {
      value: 0 as StatusValue,
      label: "Statut inconnu",
      color: "bg-gray-100 text-gray-700",
    };
  }

  return (
    <span
      className={`text-xs px-[7px] py-[2px] rounded-[7px] font-medium tracking-wide ${config.color} ${className}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
