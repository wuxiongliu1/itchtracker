export interface ItchRecord {
  id: string;
  x: number; // Percentage relative to container width
  y: number; // Percentage relative to container height
  side: 'front' | 'back';
  severity: number; // 1-5
  timestamp: number;
  weather?: {
    temp: number;
    humidity: number;
  };
}

export type ViewMode = 'record' | 'stats';
