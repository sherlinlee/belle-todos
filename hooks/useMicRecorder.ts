"use client";

import { useCallback, useEffect, useRef, useState } from "react";
type MicStatus = "idle" | "warming" | "recording" | "transcribing";

export function useMicRecorder() {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [status, setStatus] = useState<MicStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => cleanupStream, [cleanupStream]);

  const warmUp = useCallback(async () => {
    setStatus("warming");
    setError(null);
    try {
      const { preloadTranscriber } = await import("@/lib/transcribeAudio");
      await preloadTranscriber();
      setStatus("idle");
    } catch {
      setStatus("idle");
      setError("Couldn't load voice — try again in a moment.");
    }
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Mic isn't available in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.start();
      setStatus("recording");
    } catch {
      setError("Mic blocked — allow microphone when your browser asks.");
      cleanupStream();
      setStatus("idle");
    }
  }, [cleanupStream]);

  const stopAndTranscribe = useCallback(
    async (onTranscript: (text: string) => void) => {
      const recorder = recorderRef.current;
      if (!recorder || status !== "recording") return;

      setStatus("transcribing");
      setError(null);

      const blob = await new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          const type = recorder.mimeType || "audio/webm";
          resolve(new Blob(chunksRef.current, { type }));
        };
        recorder.stop();
        cleanupStream();
      });

      recorderRef.current = null;
      chunksRef.current = [];

      if (blob.size < 800) {
        setStatus("idle");
        setError("Didn't catch that — try speaking a little longer.");
        return;
      }

      try {
        const { transcribeBlob } = await import("@/lib/transcribeAudio");
        const text = await transcribeBlob(blob);
        if (text) onTranscript(text);
        else setError("Couldn't make out words — try again?");
        setStatus("idle");
      } catch {
        setStatus("idle");
        setError("Transcription hiccup — give it another go.");
      }
    },
    [cleanupStream, status],
  );

  const toggle = useCallback(
    async (onTranscript: (text: string) => void) => {
      if (status === "recording") {
        await stopAndTranscribe(onTranscript);
        return;
      }
      if (status === "transcribing" || status === "warming") return;
      await startRecording();
    },
    [startRecording, status, stopAndTranscribe],
  );

  return {
    status,
    error,
    warmUp,
    toggle,
    listening: status === "recording",
    transcribing: status === "transcribing",
    warming: status === "warming",
  };
}
