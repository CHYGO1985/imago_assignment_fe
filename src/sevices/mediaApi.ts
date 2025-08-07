import axios from 'axios';
import { MediaResponse } from '../types/media';

const API_BASE = '/api/v1';

export const searchMedia = async (
  query: string,
  page: number,
  size: number,
): Promise<MediaResponse> => {
  const response = await axios.get<MediaResponse>(`${API_BASE}/media/search`, {
    params: { query, page, size },
  });

  debugger;
  return response.data;
};
