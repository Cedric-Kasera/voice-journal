"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Square, Save } from "lucide-react";
import { useUserStore } from "@/lib/stores/user-store";
import { useJournalStore } from "@/lib/stores/journal-store";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

export function AddEntryPage() {
  const { username } = useUserStore();
  const { addEntry } = useJournalStore();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mounted, setMounted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      stopRecording();
    };
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      return true;
    } catch (error) {
      console.error("Microphone permission error:", error);
      setPermissionDenied(true);
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to record audio entries.",
        variant: "destructive",
      });
      return false;
    }
  };

  const startRecording = async () => {
    try {
      // Reset state
      setTranscript("");
      audioChunksRef.current = [];
      setPermissionDenied(false);

      // Request microphone permission
      const permissionGranted = await requestMicrophonePermission();
      if (!permissionGranted) return;

      // Start audio recording
      if (streamRef.current) {
        mediaRecorderRef.current = new MediaRecorder(streamRef.current);

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          setAudioBlob(audioBlob);
        };

        mediaRecorderRef.current.start();

        // Start speech recognition if available
        startSpeechRecognition();

        setIsRecording(true);
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording Error",
        description:
          "Could not start recording. Please check your microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const startSpeechRecognition = () => {
    // Check if SpeechRecognition is available
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = "en-US";

          recognitionRef.current.onresult = (event) => {
            let finalTranscript = "";
            for (let i = 0; i < event.results.length; i++) {
              finalTranscript += event.results[i][0].transcript;
            }
            setTranscript(finalTranscript);
          };

          recognitionRef.current.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            // Don't stop recording on recognition error, just log it
          };

          recognitionRef.current.start();
        } catch (error) {
          console.error("Speech recognition start error:", error);
          // Continue with audio recording even if speech recognition fails
        }
      } else {
        toast({
          title: "Speech Recognition Unavailable",
          description:
            "Your browser doesn't support speech recognition. Audio will be recorded without transcription.",
        });
      }
    }
  };

  const stopRecording = () => {
    // Stop speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
      recognitionRef.current = null;
    }

    // Stop media recorder
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error("Error stopping media recorder:", error);
      }
      mediaRecorderRef.current = null;
    }

    // Stop all tracks in the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsRecording(false);
  };

  const handleSaveEntry = () => {
    if (!transcript.trim() && !audioBlob) {
      toast({
        title: "Nothing to save",
        description: "Please record something before saving",
        variant: "destructive",
      });
      return;
    }

    const timestamp = Date.now();
    const id = `entry-${timestamp}`;

    addEntry({
      id,
      text: transcript,
      timestamp,
      audioBlob: audioBlob,
      starred: false,
      transcribed: !!transcript,
    });

    toast({
      title: "Entry saved",
      description: "Your journal entry has been saved successfully",
    });

    // Reset state
    setTranscript("");
    setAudioBlob(null);
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 flex flex-col pb-20">
      <Header />
      <div className="px-4 mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Hello, {username || "User"}</h1>
        <Button onClick={handleSaveEntry} disabled={!transcript && !audioBlob}>
          <Save className="h-4 w-4 mr-2" />
          Save Entry
        </Button>
      </div>

      <div className="px-4 flex-1 flex flex-col gap-4">
        <Card className="p-4 flex-1">
          <Textarea
            placeholder="Your transcription will appear here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="min-h-[180px] bg-hawkes-blue-100/50 dark:bg-gray-800/50 resize-none flex-1 border-none"
          />
        </Card>

        <div className="flex justify-center mb-4">
          {permissionDenied ? (
            <div className="text-center text-red-500 mb-4">
              <p>
                Microphone access denied. Please check your browser settings.
              </p>
              <Button
                variant="outline"
                onClick={() => setPermissionDenied(false)}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`rounded-full h-16 w-16 ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-hawkes-blue-600 hover:bg-hawkes-blue-700"
              } ${isRecording ? "recording-pulse" : ""}`}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? (
                <Square className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
