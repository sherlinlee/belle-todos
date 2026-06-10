import { env, pipeline } from "@huggingface/transformers";

env.allowLocalModels = false;
env.useBrowserCache = true;

type Transcriber = (
  audio: string,
  options?: { language?: string; task?: string },
) => Promise<{ text: string }>;

let transcriberPromise: Promise<Transcriber> | null = null;

export function preloadTranscriber() {
  if (!transcriberPromise) {
    transcriberPromise = pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-tiny.en",
    ) as Promise<Transcriber>;
  }
  return transcriberPromise;
}

export async function transcribeBlob(blob: Blob): Promise<string> {
  const transcriber = await preloadTranscriber();
  const url = URL.createObjectURL(blob);

  try {
    const result = await transcriber(url, {
      language: "english",
      task: "transcribe",
    });
    return result.text?.trim() ?? "";
  } finally {
    URL.revokeObjectURL(url);
  }
}
