export interface MediaItem {
  id: string;
  title: string;
  description: string;
  date: string;
  photographer: string;
  width: number;
  height: number;
  thumbnailUrl: string;
}

export interface MediaResponse {
  total: number;
  page: number;
  size: number;
  results: MediaItem[];
}