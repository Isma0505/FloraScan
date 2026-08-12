"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Camera,
  ImageIcon,
  Sparkles,
  X,
  RefreshCw,
  Loader2,
  ScanLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore, useT } from "@/lib/store";
import { ScanResult } from "@/components/scan-result";
import { ScanGrid } from "@/components/botanical-deco";
import { toast } from "sonner";
import type { PlantResult } from "@/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export function ScannerView() {
  const t = useT();
  const { locale } = useAppStore();

  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "analyzing">("idle");
  const [result, setResult] = useState<PlantResult | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  // ---- Image handling ----
  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED.includes(file.type)) {
        toast.error(t.toast.invalidImage);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(t.toast.imageTooLarge);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        downscaleImage(dataUrl, 1280).then(setImage);
        setResult(null);
        setSavedId(null);
        setIsFavorite(false);
      };
      reader.readAsDataURL(file);
    },
    [t]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  // ---- Analysis ----
  const analyze = useCallback(async () => {
    if (!image) {
      toast.error(t.scanner.noImage);
      return;
    }
    setStatus("analyzing");
    setResult(null);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg =
          data?.error === "API_KEY_INVALID"
            ? t.toast.scanError
            : data?.error === "RATE_LIMITED"
              ? t.toast.scanError
              : data?.error === "LOCATION_UNSUPPORTED"
                ? t.toast.locationUnsupported
                : t.toast.scanError;
        toast.error(msg);
        return;
      }
      setResult(data.result as PlantResult);
    } catch {
      toast.error(t.toast.scanError);
    } finally {
      setStatus("analyzing");
      // small delay to let the animation breathe, then show result
      setTimeout(() => setStatus("idle"), 100);
    }
  }, [image, locale, t]);

  // ---- Save / favorite / share ----
  const save = useCallback(async () => {
    if (!result || !image || savedId) return;
    try {
      const res = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image,
          result,
          isFavorite,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message);
      setSavedId(data.item.id);
      toast.success(t.toast.saved);
    } catch {
      toast.error(t.toast.saveError);
    }
  }, [result, image, savedId, isFavorite, t]);

  const toggleFavorite = useCallback(async () => {
    const next = !isFavorite;
    setIsFavorite(next);
    if (savedId) {
      try {
        await fetch(`/api/history/${savedId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isFavorite: next }),
        });
        toast.success(next ? t.toast.favorited : t.toast.unfavorited);
      } catch {
        /* ignore */
      }
    } else {
      toast.success(next ? t.toast.favorited : t.toast.unfavorited);
    }
  }, [isFavorite, savedId, t]);

  const share = useCallback(async () => {
    if (!result) return;
    const text = `🌿 ${result.plantName} (${result.latinName})\nKategori: ${result.category}\nKeyakinan: ${result.confidence.toFixed(0)}%`;
    try {
      if (navigator.share) {
        await navigator.share({ title: result.plantName, text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success(t.result.shared);
      }
    } catch {
      /* user cancelled */
    }
  }, [result, t]);

  const rescan = useCallback(() => {
    setImage(null);
    setResult(null);
    setSavedId(null);
    setIsFavorite(false);
  }, []);

  // ---- Render ----
  return (
    <section className="relative">
      <div className="mesh-bg absolute inset-0 -z-10" />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* Heading */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <ScanLine className="h-3.5 w-3.5" />
            {t.scanner.title}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t.scanner.title}
          </h1>
          <p className="mt-2 text-muted-foreground">{t.scanner.subtitle}</p>
        </div>

        {/* Main scanner card */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {status === "analyzing" ? (
              <AnalyzingView key="analyzing" image={image!} t={t} />
            ) : result && image ? (
              <ScanResult
                key="result"
                result={result}
                imageData={image}
                savedToHistory={!!savedId}
                isFavorite={isFavorite}
                onSave={save}
                onToggleFavorite={toggleFavorite}
                onShare={share}
                onRescan={rescan}
              />
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {image ? (
                  <PreviewCard
                    image={image}
                    t={t}
                    onAnalyze={analyze}
                    onRetake={rescan}
                    onOpenCamera={() => setCameraOpen(true)}
                  />
                ) : (
                  <UploadCard
                    t={t}
                    dragging={dragging}
                    setDragging={setDragging}
                    onDrop={onDrop}
                    onPick={() => fileInputRef.current?.click()}
                    onOpenCamera={() => setCameraOpen(true)}
                  />
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED.join(",")}
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                    e.target.value = "";
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Camera modal */}
      <AnimatePresence>
        {cameraOpen && (
          <CameraModal
            t={t}
            onClose={() => setCameraOpen(false)}
            onCapture={(dataUrl) => {
              downscaleImage(dataUrl, 1280).then((img) => {
                setImage(img);
                setResult(null);
                setSavedId(null);
                setIsFavorite(false);
                setCameraOpen(false);
              });
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------------- Sub-components ---------------- */

function UploadCard({
  t,
  dragging,
  setDragging,
  onDrop,
  onPick,
  onOpenCamera,
}: {
  t: ReturnType<typeof useT>;
  dragging: boolean;
  setDragging: (v: boolean) => void;
  onDrop: (e: React.DragEvent) => void;
  onPick: () => void;
  onOpenCamera: () => void;
}) {
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`relative flex min-h-[20rem] flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-colors sm:min-h-[24rem] ${
        dragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-accent/30"
      }`}
    >
      <motion.div
        animate={dragging ? { scale: 1.1 } : { scale: 1 }}
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary"
      >
        {dragging ? (
          <Sparkles className="h-9 w-9" />
        ) : (
          <Upload className="h-9 w-9" />
        )}
      </motion.div>

      <h3 className="mt-5 text-xl font-bold">
        {dragging ? t.scanner.dropHere : t.scanner.uploadHint}
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{t.scanner.formats}</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button onClick={onPick} className="gap-2 rounded-full" size="lg">
          <ImageIcon className="h-4 w-4" />
          {t.scanner.upload}
        </Button>
        <Button
          onClick={onOpenCamera}
          variant="outline"
          className="gap-2 rounded-full"
          size="lg"
        >
          <Camera className="h-4 w-4" />
          {t.scanner.camera}
        </Button>
      </div>
    </div>
  );
}

function PreviewCard({
  image,
  t,
  onAnalyze,
  onRetake,
  onOpenCamera,
}: {
  image: string;
  t: ReturnType<typeof useT>;
  onAnalyze: () => void;
  onRetake: () => void;
  onOpenCamera: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg">
      <div className="relative">
        { }
        <img
          src={image}
          alt="Preview"
          className="max-h-[60vh] w-full object-contain bg-black/5"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <Button variant="outline" onClick={onRetake} className="gap-2 rounded-full">
          <RefreshCw className="h-4 w-4" />
          {t.scanner.retake}
        </Button>
        <Button variant="ghost" onClick={onOpenCamera} className="gap-2 rounded-full">
          <Camera className="h-4 w-4" />
          {t.scanner.camera}
        </Button>
        <Button
          onClick={onAnalyze}
          className="ml-auto gap-2 rounded-full"
          size="lg"
        >
          <Sparkles className="h-4 w-4" />
          {t.scanner.analyze}
        </Button>
      </div>
    </div>
  );
}

function AnalyzingView({
  image,
  t,
}: {
  image: string;
  t: ReturnType<typeof useT>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg"
    >
      <div className="relative">
        { }
        <img
          src={image}
          alt="Analyzing"
          className="max-h-[60vh] w-full object-contain bg-black/5"
        />
        <ScanGrid active />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="flex items-center gap-3 text-white">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div>
              <div className="text-sm font-semibold">{t.scanner.analyzing}</div>
              <div className="text-xs text-white/70">
                {t.scanner.analyzingHint}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- Camera modal ---------------- */

function CameraModal({
  t,
  onClose,
  onCapture,
}: {
  t: ReturnType<typeof useT>;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const startCamera = useCallback(
    async (mode: "environment" | "user") => {
      setError(null);
      setReady(false);
      try {
        // stop existing
        streamRef.current?.getTracks().forEach((tr) => tr.stop());
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setReady(true);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Camera error";
        setError(msg);
      }
    },
    []
  );

  useEffect(() => {
    // startCamera syncs with the external device camera system; setState
    // inside is expected (setting readiness/error from media stream).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    startCamera(facing);
    return () => {
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
    };
  }, [facing]);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    onCapture(dataUrl);
  }, [onCapture]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
      >
        <div className="relative aspect-[3/4] w-full bg-black sm:aspect-video">
          {error ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-white">
              <Camera className="h-10 w-10 opacity-50" />
              <p className="text-sm text-white/70">{error}</p>
              <p className="text-xs text-white/50">
                {t.scanner.closeCamera}
              </p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="h-full w-full object-cover"
              />
              <ScanGrid active />
              {!ready && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 p-4">
          <Button variant="ghost" onClick={onClose} className="gap-2 rounded-full">
            <X className="h-4 w-4" />
            {t.scanner.closeCamera}
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFacing((f) => (f === "environment" ? "user" : "environment"))}
              className="rounded-full"
              title={t.scanner.switchCamera}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              onClick={capture}
              disabled={!ready}
              className="gap-2 rounded-full"
              size="lg"
            >
              <Camera className="h-4 w-4" />
              {t.scanner.capture}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- helpers ---------------- */

/** Downscale an image data URL to a max dimension, returns JPEG data URL. */
async function downscaleImage(dataUrl: string, maxDim = 1280): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
