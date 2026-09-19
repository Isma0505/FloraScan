"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  Trash2,
  History as HistoryIcon,
  Inbox,
  Sparkles,
  Calendar,
  ShieldAlert,
  X,
  MapPin,
  Droplets,
  Info,
  Check,
  FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppStore, useT } from "@/lib/store";
import { toast } from "sonner";
import {
  deleteHistory,
  getHistory,
  updateHistoryFavorite,
  type HistoryItem,
} from "@/lib/storage";
import type { ScanHistoryItem } from "@/types";

export function HistoryView({ favoritesOnly = false }: { favoritesOnly?: boolean }) {
  const t = useT();
  const { setView } = useAppStore();
  const [items, setItems] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filterFav, setFilterFav] = useState(favoritesOnly);
  const [selected, setSelected] = useState<ScanHistoryItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const search = query.trim().toLowerCase();
      const filtered = getHistory().map(toHistoryItem).filter((item) => {
        const matchesFavorite = !filterFav && !favoritesOnly || item.isFavorite;
        const matchesSearch = !search || [item.plantName, item.latinName, item.category]
          .some((value) => value.toLowerCase().includes(search));
        return matchesFavorite && matchesSearch;
      });
      setItems(filtered);
    } catch {
      toast.error(t.toast.loadError);
    } finally {
      setLoading(false);
    }
  }, [filterFav, favoritesOnly, query, t]);

  // debounce search
  useEffect(() => {
    const id = setTimeout(fetchItems, 250);
    return () => clearTimeout(id);
  }, [fetchItems]);

  const toggleFav = useCallback(
    async (item: ScanHistoryItem) => {
      const next = !item.isFavorite;
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, isFavorite: next } : it
        )
      );
      setSelected((s) => (s && s.id === item.id ? { ...s, isFavorite: next } : s));
      try {
        updateHistoryFavorite(item.id, next);
        toast.success(next ? t.toast.favorited : t.toast.unfavorited);
        if ((favoritesOnly || filterFav) && !next) {
          // removed from favorites view — refetch to drop it
          fetchItems();
        }
      } catch {
        toast.error(t.toast.deleteError);
      }
    },
    [favoritesOnly, filterFav, fetchItems, t]
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (selected?.id === id) setSelected(null);
    try {
      deleteHistory(id);
      toast.success(t.history.deleted);
    } catch {
      toast.error(t.toast.deleteError);
      fetchItems();
    }
  }, [deleteId, selected, t, fetchItems]);

  const title = favoritesOnly ? t.favorites.title : t.history.title;
  const subtitle = favoritesOnly ? t.favorites.subtitle : t.history.subtitle;
  const emptyText = favoritesOnly ? t.favorites.empty : t.history.empty;
  const emptyDesc = favoritesOnly ? t.favorites.emptyDesc : t.history.emptyDesc;

  return (
    <section className="relative">
      <div className="mesh-bg absolute inset-0 -z-10" />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {favoritesOnly ? <Heart className="h-3.5 w-3.5" /> : <HistoryIcon className="h-3.5 w-3.5" />}
            {title}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        </div>

        {/* Toolbar */}
        {!favoritesOnly && (
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.history.search}
                className="rounded-full pl-9"
              />
            </div>
            <div className="flex rounded-full border border-border p-1">
              <button
                onClick={() => setFilterFav(false)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  !filterFav ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {t.history.all}
              </button>
              <button
                onClick={() => setFilterFav(true)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  filterFav ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {t.history.favoritesOnly}
              </button>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="mt-7">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              title={emptyText}
              desc={emptyDesc}
              cta={t.history.startScan}
              onCta={() => setView("scanner")}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <HistoryCard
                  key={item.id}
                  item={item}
                  index={i}
                  t={t}
                  onView={() => setSelected(item)}
                  onFav={() => toggleFav(item)}
                  onDelete={() => setDeleteId(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <DetailModal
            item={selected}
            t={t}
            onClose={() => setSelected(null)}
            onFav={() => toggleFav(selected)}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.history.confirmDelete}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.history.confirmDeleteDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.history.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t.history.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function HistoryCard({
  item,
  index,
  t,
  onView,
  onFav,
  onDelete,
}: {
  item: ScanHistoryItem;
  index: number;
  t: ReturnType<typeof useT>;
  onView: () => void;
  onFav: () => void;
  onDelete: () => void;
}) {
  const danger = getDangerMeta(item.dangerLevel, t);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <button onClick={onView} className="block w-full text-left">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          { }
          <img
            src={item.imageThumb}
            alt={item.plantName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute left-2.5 top-2.5">
            <Badge className="rounded-full bg-background/90 text-foreground backdrop-blur">
              <Sparkles className="mr-1 h-3 w-3 text-primary" />
              {item.confidence.toFixed(0)}%
            </Badge>
          </div>
          <div className="absolute bottom-2.5 left-2.5 right-2.5">
            <div className="truncate text-sm font-bold text-white drop-shadow">
              {item.plantName}
            </div>
            <div className="truncate text-xs text-white/80">
              {item.latinName}
            </div>
          </div>
        </div>
      </button>

      <div className="flex items-center justify-between gap-2 p-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(item.createdAt, t)}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onFav}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-accent ${
              item.isFavorite ? "text-primary" : "text-muted-foreground"
            }`}
            title={item.isFavorite ? t.result.unfavorited : t.result.favorite}
          >
            <Heart className={`h-4 w-4 ${item.isFavorite ? "fill-primary" : ""}`} />
          </button>
          <button
            onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            title={t.history.delete}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Danger tag */}
      <div
        className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur"
        style={{ color: danger.fg, backgroundColor: danger.bg }}
      >
        <ShieldAlert className="h-3 w-3" />
        {danger.label}
      </div>
    </motion.div>
  );
}

function toHistoryItem(item: HistoryItem): ScanHistoryItem {
  return {
    ...item.result,
    id: item.id,
    imageThumb: item.image,
    imageData: item.image,
    isFavorite: item.isFavorite,
    createdAt: item.createdAt,
  };
}

function DetailModal({
  item,
  t,
  onClose,
  onFav,
}: {
  item: ScanHistoryItem;
  t: ReturnType<typeof useT>;
  onClose: () => void;
  onFav: () => void;
}) {
  const danger = getDangerMeta(item.dangerLevel, t);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="custom-scroll relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative">
          { }
          <img
            src={item.imageData}
            alt={item.plantName}
            className="aspect-[16/10] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <FlaskConical className="h-3.5 w-3.5" />
              {t.result.latinName}
            </div>
            <h2 className="mt-1 text-2xl font-extrabold text-white drop-shadow">
              {item.plantName}
            </h2>
            <p className="text-sm italic text-white/80">{item.latinName}</p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1.5">
              {item.category}
            </Badge>
            <Badge style={{ color: danger.fg, backgroundColor: danger.bg }} className="gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              {t.result.dangerLevel}: {danger.label}
            </Badge>
            <Badge variant="secondary" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {item.confidence.toFixed(0)}% {t.result.confidence}
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(item.createdAt, t)}
            </Badge>
          </div>

          <DetailBlock icon={Info} title={t.result.description}>
            {item.description || "-"}
          </DetailBlock>
          <DetailBlock icon={MapPin} title={t.result.habitat}>
            {item.habitat}
          </DetailBlock>
          <DetailBlock icon={Sparkles} title={t.result.benefits}>
            {item.benefits.length === 0 ? (
              "-"
            ) : (
              <ul className="space-y-1">
                {item.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </DetailBlock>
          <DetailBlock icon={Droplets} title={t.result.care}>
            {item.care.length === 0 ? (
              "-"
            ) : (
              <ul className="space-y-1">
                {item.care.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </DetailBlock>

          <Button
            onClick={onFav}
            variant={item.isFavorite ? "default" : "outline"}
            className="mt-2 w-full gap-2 rounded-full"
          >
            <Heart className={`h-4 w-4 ${item.isFavorite ? "fill-current" : ""}`} />
            {item.isFavorite ? t.result.unfavorited : t.result.favorite}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Info;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <div className="mb-1.5 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      <div className="rounded-xl border border-border/60 bg-background/50 p-3.5 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

function EmptyState({
  title,
  desc,
  cta,
  onCta,
}: {
  title: string;
  desc: string;
  cta: string;
  onCta: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Inbox className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{desc}</p>
      <Button onClick={onCta} className="mt-5 gap-2 rounded-full">
        <Sparkles className="h-4 w-4" />
        {cta}
      </Button>
    </motion.div>
  );
}

/* ---------- helpers ---------- */

function getDangerMeta(level: string, t: ReturnType<typeof useT>) {
  const l = (level || "").toLowerCase();
  if (l.includes("tinggi") || l.includes("high")) {
    return { fg: "oklch(0.55 0.2 25)", bg: "oklch(0.55 0.2 25 / 0.16)", label: t.result.high };
  }
  if (l.includes("sedang") || l.includes("medium") || l.includes("moderate")) {
    return { fg: "oklch(0.7 0.15 65)", bg: "oklch(0.7 0.15 65 / 0.16)", label: t.result.medium };
  }
  return { fg: "oklch(0.62 0.16 152)", bg: "oklch(0.62 0.16 152 / 0.16)", label: t.result.low };
}

function formatDate(iso: string, t: ReturnType<typeof useT>) {
  try {
    const d = new Date(iso);
    const locale = t === undefined ? "id" : (t.brand ? "id" : "en");
    return d.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
