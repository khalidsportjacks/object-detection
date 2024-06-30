"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Dropzone from "@/components/dropzone";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";
import { ModeToggle } from "@/components/ThemeSwitch";

export default function Home() {
  const [result, setResult] = useState(null);
  const [ready, setReady] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const worker = useRef<any>(null);

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("../lib/worker.ts", import.meta.url),
        {
          type: "module",
        },
      );
    }

    const onMessageReceived = (e: { data: any }) => {
      switch (e.data.status) {
        case "initiate":
          setStatus("initiate");
          setReady(false);
          break;
        case "progress":
          setStatus("progress");
          setProgress(e.data.progress);
          break;
        case "ready":
          setStatus("ready");
          setReady(true);
          break;
        case "complete":
          setStatus("complete");
          setResult(e.data.result);
          break;
      }
    };

    worker.current.addEventListener("message", onMessageReceived);

    return () =>
      worker.current.removeEventListener("message", onMessageReceived);
  });

  const detector = useCallback((image: any) => {
    if (worker.current) {
      worker.current.postMessage({ image });
    }
  }, []);

  return (
    <>
      <header className="flex items-center justify-between bg-primary p-2 shadow-md">
        <h1 className="text-lg text-secondary">
          {"Khalid's ML Project - 2024 - "}
          <span
            className="cursor-pointer text-secondary underline"
            onClick={() =>
              (window.location.href = "http://khalidkhnz.vercel.app")
            }
          >
            Portfolio
          </span>
        </h1>

        <ModeToggle />
      </header>
      <section className="min-h-screen py-10">
        <div className="container max-w-5xl">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                ML Project - Object Detector
              </h1>
              <h2 className="text-gray-500">With Transformers</h2>
            </div>

            <div className="flex-1">
              {ready !== null && ready ? (
                <div className="flex justify-end gap-2 text-emerald-600">
                  <p>Transformer Ready</p>
                  <Check />
                </div>
              ) : (
                <div className="text-end">
                  <p>Transformer status</p>
                  <Progress value={progress} />
                </div>
              )}
            </div>
          </div>

          <Dropzone
            status={status}
            setStatus={setStatus}
            detector={detector}
            result={result}
            setResult={setResult}
            className="mt-10 rounded-lg border-2 border-dashed p-20"
          />
        </div>
      </section>
    </>
  );
}
