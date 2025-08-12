import { APIClient } from '../../../../common/api/apiClient';
// import type { MediaResponse } from '../../../../types/media';
import type { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { MediaItem, MediaResponse, MediaESSearchQueryParams } from '../../types';

export interface CursorResponse {
  total: number;
  size: number;
  results: MediaItem[];
  /** Cursor from the last hit (send back as `searchAfter` for the next page) */
  lastSort?: string[];
}

const toSearchParams = (params: MediaESSearchQueryParams): URLSearchParams => {
  const urlSearchParams = new URLSearchParams();

  if (params.query) urlSearchParams.set('query', params.query);
  if (typeof params.size === 'number') urlSearchParams.set('size', String(params.size));
  if (params.sortOrder) urlSearchParams.set('sortOrder', params.sortOrder);
  if (params.startDate) urlSearchParams.set('startDate', params.startDate);
  if (params.endDate) urlSearchParams.set('endDate', params.endDate);
  if (typeof params.exactMatch === 'boolean') {
    urlSearchParams.set('exactMatch', params.exactMatch ? 'true' : 'false');
  }

  // Encode as searchAfter[]=v1&searchAfter[]=v2
  if (params.searchAfter && params.searchAfter.length) {
    for (const searchAfterParam of params.searchAfter)
      urlSearchParams.append('searchAfter[]', searchAfterParam);
  }

  return urlSearchParams;
};

/**
 * Cursor-based search.
 * - First page: call with `searchAfter` omitted/undefined.
 * - Next page: pass the previous response's `lastSort` as `searchAfter`.
 */
export const searchMediaOnESByCursor = async (
  params: MediaESSearchQueryParams,
): Promise<CursorResponse> => {
  const res = await APIClient.get('media/search', { searchParams: toSearchParams(params) }).json<{
    total: number;
    size: number;
    results?: MediaItem[]; // preferred shape from your API
    hits?: SearchHit[]; // if the API returns raw ES hits instead
    lastSort?: (string | number)[];
  }>();

  // If your API already returns `results`, use them directly.
  // If it returns `hits`, you’d map them here to `MediaItem[]`.
  const results: MediaItem[] = (res as any).results ?? [];

  // Coerce ES-style mixed tuple into string[]
  const lastSort: string[] | undefined = Array.isArray(res.lastSort)
    ? res.lastSort.map((sortPram) => String(sortPram))
    : undefined;

  return {
    total: res.total,
    size: res.size,
    results,
    lastSort,
  };
};
