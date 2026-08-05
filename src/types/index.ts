// Shared types for AI Plant Scanner

export interface PlantResult {
  detected: boolean;
  plantName: string;
  latinName: string;
  category: string;
  confidence: number; // 0-100
  habitat: string;
  benefits: string[];
  care: string[];
  dangerLevel: "Rendah" | "Sedang" | "Tinggi" | string;
  description: string;
}

export interface ScanHistoryItem extends PlantResult {
  id: string;
  imageThumb: string;
  imageData: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface ScanRequest {
  image: string; // base64 data URL
  apiKey: string;
}

export interface SaveScanRequest {
  image: string; // base64 data URL
  result: PlantResult;
}
