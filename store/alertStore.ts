import { create } from "zustand";
import type { StateCreator } from "zustand";

export enum AlertTypeStatus {
  ERROR = "error",
  SUCCESS = "success",
  INFO = "info",
}

export type AlertType = {
  content: string;
  type?: AlertTypeStatus;
  delay?: number;
};

export type AlertStoreType = {
  content: string;
  visible: boolean;
  type: AlertTypeStatus;
  delay: number;
  setAlert: (alert: AlertType) => void;
  clearAlert: () => void;
};

const createAlertStore: StateCreator<AlertStoreType> = (set) => ({
  content: "",
  visible: false,
  type: AlertTypeStatus.SUCCESS,
  delay: 5000,

  setAlert: (alert: AlertType) =>
    set({
      content: alert.content,
      visible: true,
      type: alert.type || AlertTypeStatus.SUCCESS,
      delay: alert.delay || 5000,
    }),

  clearAlert: () =>
    set({
      content: "",
      visible: false,
    }),
});

const useAlertStore = create<AlertStoreType>(createAlertStore);

export default useAlertStore;
