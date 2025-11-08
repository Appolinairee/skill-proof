import React from "react";
import { useRecorder } from "./useRecorder";
import { useVisualizer } from "./useVisualizer";
import { TimerVisualizer } from "./TimerVisualizer";
import CustomAudioPlayer from "../../message/CustomAudioPlayer";
import { RecorderControls } from "./RecorderControls";
import { useStoreMessage } from "@/api/messageServices";

interface RecorderProps {
  onClose: SetState;
}

const Recorder: React.FC<RecorderProps> = ({ onClose }) => {
  const {
    recording,
    paused,
    audioUrl,
    audioBlob,
    duration,
    error,
    togglePause,
    cancelRecording,
    stopRecording,
    stream,
    previewUrl,
  } = useRecorder(onClose);

  const [pendingSend, setPendingSend] = React.useState(false);

  const { handleStoreMessage, isLoading } = useStoreMessage(() => {
    setPendingSend(false);
    onClose();
  });

  const visualBars = useVisualizer(stream, recording && !paused);

  React.useEffect(() => {
    if (pendingSend && audioBlob) {
      const data = {
        media: new File([audioBlob], "audio/webm", {
          type: "audio/webm",
        }),
      };
      handleStoreMessage(data);
    }
  }, [pendingSend, audioBlob, handleStoreMessage]);

  const onSend = () => {
    if (isLoading) return;
    if (recording) {
      setPendingSend(true);
      stopRecording();
    } else if (audioUrl && audioBlob) {
      const data = {
        media: new File([audioBlob], "audio/webm", {
          type: "audio/webm",
        }),
      };
      handleStoreMessage(data);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[90px]">
      {error && (
        <div className="text-red-500 text-xs mb-2 w-full text-center">
          {error}
        </div>
      )}
      {recording && !paused && (
        <TimerVisualizer duration={duration} visualBars={visualBars} />
      )}

      {paused && !!(audioUrl || previewUrl) && (
        <div className="flex flex-col items-center w-full mb-2">
          <CustomAudioPlayer
            url={audioUrl || previewUrl!}
            className="!w-full"
            isLocal
          />
        </div>
      )}

      <RecorderControls
        recording={recording}
        paused={paused}
        audioUrl={audioUrl}
        audioBlob={audioBlob}
        togglePause={togglePause}
        cancelRecording={cancelRecording}
        isLoading={isLoading}
        onSend={onSend}
      />
    </div>
  );
};

export default Recorder;
