"use client";

import { useEffect, useState } from "react";
import { BsActivity } from "react-icons/bs";
import { MdErrorOutline } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { cn } from "@/utils/utils";
import useAlertStore from "@/store/alertStore";
import CloserButton from "./modal/CloserButton";

const Alert = () => {
  const { content, visible, type, delay, clearAlert } = useAlertStore(
    (state) => state
  );

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const newAudio = new Audio("/assets/alert.mp3");
      setAudio(newAudio);
    }
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (visible && audio) {
      const playAudio = async () => {
        try {
          await audio.play();
        } catch (error) {
          console.error("Erreur lors de la lecture du son :", error);
        }
      };

      playAudio();

      timeout = setTimeout(() => {
        clearAlert();
      }, delay);
    }

    return () => clearTimeout(timeout);
  }, [visible, delay, clearAlert, audio]);

  if (!visible) return null;

  let border = "border-black/10";
  let title = "";
  let icon = null;
  let titleColor = "";

  switch (type) {
    case "success":
      border = "border-green-700";
      title = "Succès";
      icon = <FaCheckCircle className=" text-green-700 " />;
      titleColor = "text-green-700";
      break;
    case "error":
      border = "border-red-500";
      title = "Erreur";
      titleColor = "text-red-500";
      icon = <MdErrorOutline className="text-red-500" />;
      break;
    case "info":
    default:
      border = "border-black/10";
      titleColor = "text-black/80";
      title = "Information";
      icon = <BsActivity className="text-primary" />;
      break;
  }

  return (
    <div
      className={cn(
        "fixed top-[-100px] left-1/2 -translate-x-1/2 flex items-center w-fit z-50 bg-white medium-shadow rounded-full gap-4 py-2 px-6 transition-all duration-300 ease-in-out max-w-[400px] border ",
        border,
        visible && "top-3 opacity-100"
      )}
      style={{
        transition: "top 0.5s ease-in-out, opacity 0.5s ease-in-out",
      }}
    >
      <p
        className={cn(
          "border-solid border-[1px] rounded-full p-1 flex items-center justify-center",
          border
        )}
      >
        {icon}
      </p>

      <div className="">
        <div className={cn("text-[12px]", titleColor)}>{title}</div>
        <p className="line-clamp-2 font-medium text-[15px]">{content}</p>
      </div>

      <CloserButton setState={clearAlert} />
    </div>
  );
};

export default Alert;
