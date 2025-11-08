import { useState, useRef, useEffect } from "react";

export function useVisualizer(stream: MediaStream | null, active: boolean) {
  const [visualBars, setVisualBars] = useState<number[]>([]);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    if (!stream || !active) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setVisualBars([]);
      return;
    }
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 32;
    analyserRef.current = analyser;
    const source = audioContext.createMediaStreamSource(stream);
    sourceRef.current = source;
    source.connect(analyser);
    const animate = () => {
      if (!active) return;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
      setVisualBars(Array.from(dataArray));
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      analyserRef.current = null;
      sourceRef.current = null;
      audioContextRef.current = null;
      setVisualBars([]);
    };
  }, [stream, active]);
  return visualBars;
}
