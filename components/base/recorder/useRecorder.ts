import { useState, useRef, useEffect, useCallback } from "react";

const MAX_DURATION = 300;

type SetState = (v?: any) => void;

export function useRecorder(onClose: SetState) {
    const [recording, setRecording] = useState(false);
    const [paused, setPaused] = useState(false);
    const pausedRef = useRef(false);
    const recordingRef = useRef<boolean>(false);
    const streamRef = useRef<MediaStream | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    // keep refs in sync with state where needed
    useEffect(() => { recordingRef.current = recording; }, [recording]);
    useEffect(() => { streamRef.current = stream; }, [stream]);

    useEffect(() => {
        let mounted = true;
        let localStream: MediaStream | null = null;
        const start = async () => {
            setError(null);
            setAudioUrl(null);
            setAudioBlob(null);
            setDuration(0);
            try {
                localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                if (!mounted) return;
                setStream(localStream);
                streamRef.current = localStream;
                const mediaRecorder = new MediaRecorder(localStream, { mimeType: "audio/webm" });
                mediaRecorderRef.current = mediaRecorder;
                audioChunks.current = [];
                timerRef.current = setInterval(() => {
                    setDuration((d) => {
                        const next = d + 1;
                        if (next >= MAX_DURATION) {
                            if (mediaRecorderRef.current && !pausedRef.current) {
                                try {
                                    mediaRecorderRef.current.pause();
                                } catch { }
                                setPaused(true);
                                pausedRef.current = true;
                            }
                            return next;
                        }
                        return next;
                    });
                }, 1000);
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        audioChunks.current.push(e.data);
                        // Si on est en pause et pas encore de blob final, génère le previewUrl immédiatement
                        if (pausedRef.current && !audioBlob) {
                            const tempBlob = new Blob(audioChunks.current, { type: "audio/webm" });
                            setPreviewUrl(URL.createObjectURL(tempBlob));
                        }
                    }
                };
                mediaRecorder.onstop = () => {
                    const blob = new Blob(audioChunks.current, { type: "audio/webm" });
                    setAudioBlob(blob);
                    setAudioUrl(URL.createObjectURL(blob));
                };
                mediaRecorder.start();
                setRecording(true);
                recordingRef.current = true;
                setPaused(false);
                pausedRef.current = false;
            } catch {
                setError("Autorisation micro refusée. Veuillez autoriser l'accès au micro.");
            }
        };
        start();
        return () => {
            mounted = false;
            if (timerRef.current) clearInterval(timerRef.current);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                try { mediaRecorderRef.current.stop(); } catch { }
            }
            if (localStream) localStream.getTracks().forEach((t) => t.stop());
        };

    }, []);

    const togglePause = useCallback(() => {
        if (!mediaRecorderRef.current) return;
        if (pausedRef.current) {
            try { mediaRecorderRef.current.resume(); } catch { }
            setPaused(false);
            pausedRef.current = false;
            // Redémarre le timer
            if (!timerRef.current) {
                timerRef.current = setInterval(() => {
                    setDuration((d) => {
                        const next = d + 1;
                        if (next >= MAX_DURATION) {
                            if (mediaRecorderRef.current && !pausedRef.current) {
                                try { mediaRecorderRef.current.pause(); } catch { }
                                setPaused(true);
                                pausedRef.current = true;
                                if (timerRef.current) clearInterval(timerRef.current);
                                timerRef.current = null;
                            }
                            return next;
                        }
                        return next;
                    });
                }, 1000);
            }
        } else {
            try { mediaRecorderRef.current.pause(); } catch { }
            // Force la génération d'un chunk pour la prévisualisation
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                try { mediaRecorderRef.current.requestData(); } catch { }
            }
            setPaused(true);
            pausedRef.current = true;
            // Stoppe le timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, []);

    // Générer l'URL de prévisualisation dès qu'on est en pause et qu'un chunk arrive
    useEffect(() => {
        if (pausedRef.current && !audioBlob && audioChunks.current.length > 0) {
            const tempBlob = new Blob(audioChunks.current, { type: "audio/webm" });
            setPreviewUrl(URL.createObjectURL(tempBlob));
        } else if (!pausedRef.current) {
            setPreviewUrl(null);
        }
    }, [paused, audioBlob]);

    const cancelRecording = useCallback(() => {
        if (mediaRecorderRef.current && recordingRef.current) {
            try { mediaRecorderRef.current.stop(); } catch { }
        }
        setAudioUrl(null);
        setAudioBlob(null);
        setRecording(false);
        recordingRef.current = false;
        setPaused(false);
        pausedRef.current = false;
        setDuration(0);
        const s = streamRef.current;
        if (s) s.getTracks().forEach((t) => t.stop());
        onClose();
    }, [onClose]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && recordingRef.current) {
            try { mediaRecorderRef.current.stop(); } catch { }
        }
        setRecording(false);
        recordingRef.current = false;
        setPaused(false);
        pausedRef.current = false;
        const s = streamRef.current;
        if (s) s.getTracks().forEach((t) => t.stop());
    }, []);

    return {
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
        audioChunks: audioChunks.current,
        previewUrl,
    };
}
