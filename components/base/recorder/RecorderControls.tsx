import React from "react";
import { MicrophoneIcon } from "../../../public/assets/icons/icons";
import { SendIcon } from "../../../public/assets/icons/filterIcons";
import { PauseCircleIcon } from "../../../public/assets/icons/audioIcons";
import { DeleteIcon } from "../table/TableIcons";
import { RiLoader2Line } from "react-icons/ri";

interface RecorderControlsProps {
  recording: boolean;
  paused: boolean;
  audioUrl: string | null;
  audioBlob: Blob | null;
  togglePause: () => void;
  cancelRecording: () => void;
  isLoading: boolean;
  onSend: () => void;
}

export const RecorderControls: React.FC<RecorderControlsProps> = ({
  recording,
  paused,
  audioUrl,
  togglePause,
  cancelRecording,
  isLoading,
  onSend,
}) => (
  <div className="flex items-center gap-4 w-full justify-between mt-2 ">
    <div className="flex items-center justify-between gap-3 w-full">
      {(recording || audioUrl) && (
        <span
          className="bg-red-200 hover:bg-red-500 p-[6px] rounded-full cursor-pointer transition group/item text-gray-700"
          onClick={cancelRecording}
          title="Supprimer la catégorie"
        >
          <DeleteIcon className="w-5 h-5 group-hover/item:text-white" />
        </span>
      )}
      {recording && (
        <button
          type="button"
          onClick={togglePause}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
        >
          {paused ? (
            <MicrophoneIcon className="w-6 h-6" />
          ) : (
            <PauseCircleIcon className="w-6 h-6" />
          )}
        </button>
      )}
      {(recording || audioUrl) && (
        <button
          type="button"
          onClick={onSend}
          className="p-2 rounded-full bg-primary text-white cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? (
            <RiLoader2Line className="text-[16px] animate-spin" />
          ) : (
            <SendIcon className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  </div>
);
