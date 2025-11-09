export enum UserStatus {
  VERIFIED = "VERIFIED",
  NON_VERIFIED = "NON_VERIFIED",
  DELETED = "DELETED"
}

export const UserStatusLabels = {
  [UserStatus.VERIFIED]: "Vérifié",
  [UserStatus.NON_VERIFIED]: "Non vérifié",
  [UserStatus.DELETED]: "Supprimé"
};

export const ROLES = {
  COMPANY: "company",
  USER: "user",
  ADMIN: "super-admin"
};

export const userStatusConfig = {
  [UserStatus.NON_VERIFIED]: {
    value: 0,
    label: "Non vérifié",
    color: "bg-yellow-100 text-yellow-800",
  },
  [UserStatus.VERIFIED]: {
    value: 1,
    label: "Vérifié",
    color: "bg-green-100 text-green-800",
  },
  [UserStatus.DELETED]: {
    value: -1,
    label: "Supprimé",
    color: "bg-red-100 text-red-800",
  },
};
