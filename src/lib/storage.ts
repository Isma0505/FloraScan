import type { PlantResult } from "@/types";

export interface HistoryItem {
  id: string;
  image: string;
  result: PlantResult;
  isFavorite: boolean;
  createdAt: string;
}

const STORAGE_KEY = "flora-scan-history";

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    return JSON.parse(data) as HistoryItem[];
  } catch {
    return [];
  }
}

export function saveHistory(item: HistoryItem): void {
  const history = getHistory();

  history.unshift(item);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function updateHistoryFavorite(
  id: string,
  isFavorite: boolean
): void {
  const history = getHistory();

  const updatedHistory = history.map((item) =>
    item.id === id
      ? { ...item, isFavorite }
      : item
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedHistory)
  );
}

export function deleteHistory(id: string): void {
  const history = getHistory();

  const updatedHistory = history.filter(
    (item) => item.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedHistory)
  );
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getFavorites(): HistoryItem[] {
  return getHistory().filter(
    (item) => item.isFavorite
  );
}