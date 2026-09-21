"use client";

import { motion } from "framer-motion";
import {
  Sprout,
  MapPin,
  Sparkles,
  Droplets,
  ShieldAlert,
  Info,
  Heart,
  Share2,
  Save,
  RotateCcw,
  Check,
  FlaskConical,
  FileText,
  FileDown,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/store";
import type { PlantResult, ScanHistoryItem } from "@/types";

interface ScanResultProps {
  result: PlantResult;
  imageData: string;
  savedToHistory?: boolean;
  isFavorite?: boolean;
  existingId?: string;
  onSave: () => void;
  onToggleFavorite: () => void;
  onShare: () => void;
  onRescan: () => void;
}

export function ScanResult({
  result,
  imageData,
  savedToHistory,
  isFavorite,
  onSave,
  onToggleFavorite,
  onShare,
  onRescan,
}: ScanResultProps) {
  const t = useT();

  if (!result.detected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8"
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-xl font-bold">{t.result.notDetected}</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {t.result.notDetectedDesc}
          </p>
          <Button onClick={onRescan} className="mt-5 gap-2 rounded-full">
            <RotateCcw className="h-4 w-4" />
            {t.result.rescan}
          </Button>
        </div>
      </motion.div>
    );
  }

  const dangerColor = getDangerColor(result.dangerLevel, t);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-8 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xl"
    >
      {/* Header with image + name */}
      <div className="relative grid gap-0 md:grid-cols-2">
        <div className="relative aspect-square md:aspect-auto">
          { }
          <img
            src={imageData}
            alt={result.plantName}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r" />
          <div className="absolute left-4 top-4">
            <Badge className="gap-1.5 rounded-full bg-background/90 text-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" />
              {result.confidence.toFixed(0)}% {t.result.confidence}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FlaskConical className="h-4 w-4" />
            {t.result.latinName}
          </div>
          <h2 className="mt-1 text-3xl font-extrabold tracking-tight">
            {result.plantName}
          </h2>
          <p className="mt-1 text-lg italic text-muted-foreground">
            {result.latinName}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1.5 rounded-full">
              <Sprout className="h-3.5 w-3.5 text-primary" />
              {result.category}
            </Badge>
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full"
              style={{ color: dangerColor.fg, backgroundColor: dangerColor.bg }}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              {t.result.dangerLevel}: {dangerColor.label}
            </Badge>
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full"
              style={getToxicityColor(result.isToxic)}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              {t.result.toxicity}: {result.isToxic ? t.result.toxic : t.result.nonToxic}
            </Badge>
          </div>

          {/* Confidence bar */}
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t.result.confidence}</span>
              <span className="font-semibold text-primary">
                {result.confidence.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.confidence}%` }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Body details */}
      <div className="grid gap-5 p-6 sm:p-8 md:grid-cols-2">
        <InfoBlock icon={Info} title={t.result.description}>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {result.description}
          </p>
        </InfoBlock>

        <InfoBlock icon={MapPin} title={t.result.habitat}>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {result.habitat}
          </p>
        </InfoBlock>

        <InfoBlock icon={Sparkles} title={t.result.benefits}>
          <ul className="space-y-1.5">
            {result.benefits.length === 0 ? (
              <li className="text-sm text-muted-foreground">-</li>
            ) : (
              result.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{b}</span>
                </li>
              ))
            )}
          </ul>
        </InfoBlock>

        <InfoBlock icon={Droplets} title={t.result.care}>
          <ul className="space-y-1.5">
            {result.care.length === 0 ? (
              <li className="text-sm text-muted-foreground">-</li>
            ) : (
              result.care.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{c}</span>
                </li>
              ))
            )}
          </ul>
        </InfoBlock>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2.5 border-t border-border/60 bg-muted/30 p-4 sm:p-6">
        <Button
          onClick={onSave}
          disabled={savedToHistory}
          className="gap-2 rounded-full"
          variant={savedToHistory ? "secondary" : "default"}
        >
          {savedToHistory ? (
            <>
              <Check className="h-4 w-4" /> {t.result.saved}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> {t.result.saveHistory}
            </>
          )}
        </Button>
        <Button
          onClick={onToggleFavorite}
          variant="outline"
          className="gap-2 rounded-full"
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`}
          />
          {isFavorite ? t.result.unfavorited : t.result.favorite}
        </Button>
        <Button onClick={onShare} variant="outline" className="gap-2 rounded-full">
          <Share2 className="h-4 w-4" />
          {t.result.share}
        </Button>
        <Button onClick={() => downloadWord(imageData, result, t)} variant="outline" className="gap-2 rounded-full">
          <FileText className="h-4 w-4" /> {t.result.downloadWord}
        </Button>
        <Button onClick={() => downloadPdf(imageData, result, t)} variant="outline" className="gap-2 rounded-full">
          <FileDown className="h-4 w-4" /> {t.result.downloadPdf}
        </Button>
        <Button
          onClick={onRescan}
          variant="ghost"
          className="ml-auto gap-2 rounded-full"
        >
          <RotateCcw className="h-4 w-4" />
          {t.result.rescan}
        </Button>
      </div>
    </motion.div>
  );
}

function InfoBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Info;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/50 p-5">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function getDangerColor(
  level: string,
  t: ReturnType<typeof useT>
): { fg: string; bg: string; label: string } {
  const l = level.toLowerCase();
  if (l.includes("tinggi") || l.includes("high")) {
    return {
      fg: "oklch(0.55 0.2 25)",
      bg: "oklch(0.55 0.2 25 / 0.12)",
      label: t.result.high,
    };
  }
  if (l.includes("sedang") || l.includes("medium") || l.includes("moderate")) {
    return {
      fg: "oklch(0.7 0.15 65)",
      bg: "oklch(0.7 0.15 65 / 0.12)",
      label: t.result.medium,
    };
  }
  return {
    fg: "oklch(0.62 0.16 152)",
    bg: "oklch(0.62 0.16 152 / 0.12)",
    label: t.result.low,
  };
}

function getToxicityColor(isToxic: boolean) {
  return isToxic
    ? { color: "oklch(0.55 0.2 25)", backgroundColor: "oklch(0.55 0.2 25 / 0.12)" }
    : { color: "oklch(0.62 0.16 152)", backgroundColor: "oklch(0.62 0.16 152 / 0.12)" };
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadWord(imageData: string, result: PlantResult, t: ReturnType<typeof useT>) {
  const html = `<html><body><h1>${escapeHtml(result.plantName)}</h1><img src="${imageData}" style="max-width:500px"><p><i>${escapeHtml(result.latinName)}</i></p><p><b>${t.result.toxicity}:</b> ${result.isToxic ? t.result.toxic : t.result.nonToxic}</p><p><b>${t.result.category}:</b> ${escapeHtml(result.category)}</p><p><b>${t.result.description}:</b> ${escapeHtml(result.description)}</p><p><b>${t.result.habitat}:</b> ${escapeHtml(result.habitat)}</p><h2>${t.result.benefits}</h2><ul>${result.benefits.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul><h2>${t.result.care}</h2><ul>${result.care.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></body></html>`;
  downloadBlob(new Blob([html], { type: "application/msword" }), `${slugify(result.plantName)}.doc`);
}

function downloadPdf(imageData: string, result: PlantResult, t: ReturnType<typeof useT>) {
  const pdf = new jsPDF();
  pdf.setFontSize(20);
  pdf.text(result.plantName, 15, 20);
  pdf.setFontSize(11);
  pdf.text(result.latinName, 15, 28);
  pdf.text(`${t.result.toxicity}: ${result.isToxic ? t.result.toxic : t.result.nonToxic}`, 15, 38);
  pdf.text(`${t.result.category}: ${result.category}`, 15, 46);
  pdf.text(`${t.result.habitat}: ${result.habitat}`, 15, 54, { maxWidth: 180 });
  pdf.text(`${t.result.description}:`, 15, 70);
  pdf.text(pdf.splitTextToSize(result.description, 180), 15, 78);
  pdf.addImage(imageData, "JPEG", 15, 100, 80, 80);
  let y = 195;
  pdf.setFontSize(12);
  pdf.text(`${t.result.benefits}:`, 15, y);
  y += 7;
  pdf.setFontSize(10);
  for (const item of result.benefits) {
    pdf.text(pdf.splitTextToSize(`- ${item}`, 180), 18, y);
    y += 6;
  }
  y += 4;
  pdf.setFontSize(12);
  pdf.text(`${t.result.care}:`, 15, y);
  y += 7;
  pdf.setFontSize(10);
  for (const item of result.care) {
    pdf.text(pdf.splitTextToSize(`- ${item}`, 180), 18, y);
    y += 6;
  }
  pdf.save(`${slugify(result.plantName)}.pdf`);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] || char);
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "florascan-result";
}
export type { ScanHistoryItem };
