import React from "react";

const formatTime = (s: number) => {
  const m = Math.floor(s / 60).toString();
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}`;
};

export const TimerVisualizer = ({
  duration,
  visualBars,
}: {
  duration: number;
  visualBars: number[];
}) => {
  const BAR_COUNT = 48;
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % visualBars.length);
    }, 30);
    return () => clearInterval(interval);
  }, [visualBars.length]);

  const barsToShow = Array.from({ length: BAR_COUNT }, (_, i) => {
    const idx = (offset + i) % visualBars.length;
    return visualBars[idx];
  });

  return (
    <div className="flex items-center w-full gap-2 mb-1">
      <div className="text-[14px] font-medium text-gray-600 w-[30px] mx-auto text-right">
        {formatTime(duration)}
      </div>
      <div className="flex-1 flex items-center h-8 gap-[3px] overflow-hidden">
        {barsToShow.map((v, i) => (
          <div
            key={i}
            style={{
              height: `${(v / 255) * 32 + 4}px`,
              width: 10,
              minWidth: 4,
              maxWidth: 4,
              background: "#3664FF",
              borderRadius: 2,
              transition: "height 0.1s",
            }}
          />
        ))}
      </div>
    </div>
  );
};
