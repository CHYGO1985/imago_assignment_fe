import { searchMedia } from '../mediaApi';
import { APIClient } from '../../common/api/apiClient';
import type { MediaResponse } from '../../types/media';

jest.mock('../../common/api/apiClient', () => ({
  APIClient: {
    get: jest.fn(),
  },
}));

describe('searchMedia', () => {
  const mockResponse: MediaResponse = {
    total: 100,
    page: 1,
    size: 10,
    results: [
      {
        id: '1',
        title: 'Sample Item',
        description: 'A sample media item',
        date: '2025-08-07T00:00:00Z',
        photographer: 'John Doe',
        width: 1920,
        height: 1080,
        thumbnailUrl: 'http://example.com/thumb.jpg',
      },
    ],
  };

  beforeEach(() => {
    (APIClient.get as jest.Mock).mockReset();
  });

  it('should call APIClient.get with correct endpoint and params and return data', async () => {
    const jsonMock = jest.fn().mockResolvedValue(mockResponse);
    (APIClient.get as jest.Mock).mockReturnValue({ json: jsonMock });

    const query = 'nature';
    const page = 2;
    const size = 5;

    const result = await searchMedia(query, page, size);

    expect(APIClient.get).toHaveBeenCalledWith('media/search', {
      searchParams: {
        query,
        page: page.toString(),
        size: size.toString(),
      },
    });
    expect(jsonMock).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it('should propagate errors from APIClient.get or json', async () => {
    const error = new Error('Network error');
    const jsonMock = jest.fn().mockRejectedValue(error);
    (APIClient.get as jest.Mock).mockReturnValue({ json: jsonMock });

    await expect(searchMedia('', 0, 0)).rejects.toThrow('Network error');
  });
});
