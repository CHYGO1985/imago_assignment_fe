import { ISODateString, SortOrder } from './common.type';
import { SearchAfter } from './media.type';

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  date: string;
  photographer?: string;
  width?: number;
  height?: number;
  thumbnailUrl: string;
}

export interface MediaSource {
  bildnummer?: string;
  datum?: string;
  suchtext?: string;
  fotografen?: string;
  hoehe?: string;
  breite?: string;
  db?: string;
}

export interface DateRange {
  startDate: ISODateString;
  endDate: ISODateString;
}

export interface ESSearchOptions {
  size?: number;
  searchAfter?: SearchAfter;
  sortOrder?: SortOrder;
  dateRange?: DateRange;
  exactMatch?: boolean;
}

export interface MediaESSearchQueryParams {
  query?: string;
  size?: number;
  searchAfter?: string[];
  sortOrder?: SortOrder;
  startDate?: ISODateString;
  endDate?: ISODateString;
  exactMatch?: boolean;
}

export interface MediaResponse {
  total: number;
  size: number;
  results: MediaItem[];
}