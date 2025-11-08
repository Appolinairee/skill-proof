"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import { BsActivity } from "react-icons/bs";
import { MdErrorOutline } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { cn } from "@/utils/utils";
import useAlertStore from "@/store/alertStore";
import renderMessageContent from "@/utils/renderMessage";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme();
  const { content, visible, type, delay, clearAlert } = useAlertStore(
    (state) => state
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/assets/alert.mp3");
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (visible && content) {
      if (audioRef.current) {
        const playAudio = async () => {
          try {
            await audioRef.current?.play();
          } catch (error) {
            console.error("Erreur lors de la lecture du son :", error);
          }
        };
        playAudio();
      }

      let icon = null;

      let title = "";
      const rendered = renderMessageContent(content);

      switch (type) {
        case "success":
          icon = <FaCheckCircle className="text-green-700" />;
          title = "Succès";
          toast(title, {
            description: rendered,
            icon,
            duration: delay,
            onDismiss: clearAlert,
          });
          break;
        case "error":
          icon = <MdErrorOutline className="text-red-500" />;
          title = "Erreur";
          toast(title, {
            description: rendered,
            icon,
            duration: delay,
            onDismiss: clearAlert,
          });
          break;
        case "info":
        default:
          icon = <BsActivity className="text-primary" />;
          title = "Information";
          toast(title, {
            description: rendered,
            icon,
            duration: delay,
            onDismiss: clearAlert,
          });
          break;
      }
    }
  }, [visible, content, type, delay, clearAlert]);

  const getBorderClass = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-700";
      case "error":
        return "border-red-500";
      case "info":
      default:
        return "border-primary";
    }
  };

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group gilroy"
      toastOptions={{
        classNames: {
          toast: cn(
            `group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:shadow-lg group-[.toaster]:!rounded-[20px] group-[.toaster]:!border group-[.toaster]:!${getBorderClass(type)}`
          ),
          title: "",
          description:
            "group-[.toast]:font-semibold group-[.toast]:text-[16px] line-clamp-2",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export const showToast = {
  success: (message: string, duration = 5000) => {
    toast("Succès", {
      description: message,
      icon: <FaCheckCircle className="text-green-700 text-[30px]! w-10!" />,
      duration,
    });
  },
  error: (message: string, duration = 5000) => {
    toast("Erreur", {
      description: message,
      icon: <MdErrorOutline className="text-red-500 text-[30px]! w-10!" />,
      duration,
    });
  },
  info: (message: string, duration = 5000) => {
    toast("Information", {
      description: message,
      icon: <BsActivity className="text-primary text-[30px]! w-10!" />,
      duration,
    });
  },
};

export { Toaster };
