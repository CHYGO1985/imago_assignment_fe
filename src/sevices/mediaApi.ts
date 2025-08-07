import { APIClient } from '../common/api/apiClient';
import type { MediaResponse } from '../types/media';

/**
 * Search media items by query, page, and size.
 * @param query - Search keyword
 * @param page  - Page number (0-based)
 * @param size  - Number of items per page
 * @returns A promise resolving to MediaResponse
 */
export const searchMedia = async (
  query: string,
  page: number,
  size: number,
): Promise<MediaResponse> => {
  const searchParams = {
    query,
    page: page.toString(),
    size: size.toString(),
  };

  const response = await APIClient.get('media/search', {
    searchParams,
  }).json<MediaResponse>();

  return response;
};
