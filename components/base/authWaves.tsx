"use client";

import dynamic from "next/dynamic";
import { cn } from "@/utils/utils";

const Waves = dynamic(() => import("@/components/base/wavesBackground").then(mod => mod.Waves), { ssr: false });

interface AuthWavesProps {
  className?: string;
  intensity?: "light" | "medium" | "strong";
}

const presets = {
  light: {
    lineColor: "rgba(0,0,0,0.05)",
    waveSpeedX: 0.01,
    waveSpeedY: 0.005,
    waveAmpX: 15,
    waveAmpY: 10,
  },
  medium: {
    lineColor: "rgba(0,0,0,0.08)",
    waveSpeedX: 0.015,
    waveSpeedY: 0.008,
    waveAmpX: 25,
    waveAmpY: 15,
  },
  strong: {
    lineColor: "rgba(0,0,0,0.12)",
    waveSpeedX: 0.02,
    waveSpeedY: 0.01,
    waveAmpX: 35,
    waveAmpY: 20,
  },
};

export function AuthWaves({ className, intensity = "medium" }: AuthWavesProps) {
  const preset = presets[intensity];

  return (
    <Waves
      {...preset}
      backgroundColor="transparent"
      friction={0.95}
      tension={0.003}
      maxCursorMove={80}
      xGap={15}
      yGap={40}
      className={cn("z-0", className)}
    />
  );
}
