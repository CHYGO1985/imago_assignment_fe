import { searchMediaOnESByCursor } from '../mediaApi';
import { APIClient } from '../../../../common/api/apiClient';
import { MediaESSearchQueryParams } from '../../types';

jest.mock('../../../../common/api/apiClient', () => ({
  APIClient: {
    get: jest.fn(),
  },
}));

describe('searchMediaOnESByCursor', () => {
  const getMock = APIClient.get as unknown as jest.Mock;

  beforeEach(() => {
    getMock.mockReset();
  });

  it('calls APIClient.get with URLSearchParams and returns results (no cursor)', async () => {
    const apiResponse = {
      total: 3,
      size: 10,
      results: [
        {
          id: '1',
          title: 'Sample',
          description: 'Desc',
          date: '2025-08-07T00:00:00Z',
          photographer: 'Alice',
          width: 100,
          height: 200,
          thumbnailUrl: 'http://example.com/1.jpg',
        },
      ],
      lastSort: ['1690000000000', 'doc-1'],
    };

    const jsonMock = jest.fn().mockResolvedValue(apiResponse);
    getMock.mockReturnValue({ json: jsonMock });

    const params: MediaESSearchQueryParams = {
      query: 'nature',
      size: 10,
      sortOrder: 'desc' as const,
      startDate: '2025-08-01',
      endDate: '2025-08-31',
      exactMatch: false,
      // no searchAfter on first page
    };

    const result = await searchMediaOnESByCursor(params);

    expect(getMock).toHaveBeenCalledTimes(1);
    const [endpoint, options] = getMock.mock.calls[0];
    expect(endpoint).toBe('media/search');

    // Ensure URLSearchParams built correctly
    expect(options.searchParams).toBeInstanceOf(URLSearchParams);
    const sp: URLSearchParams = options.searchParams;
    expect(sp.get('query')).toBe('nature');
    expect(sp.get('size')).toBe('10');
    expect(sp.get('sortOrder')).toBe('desc');
    expect(sp.get('startDate')).toBe('2025-08-01');
    expect(sp.get('endDate')).toBe('2025-08-31');
    expect(sp.get('exactMatch')).toBe('false');
    expect(sp.getAll('searchAfter[]')).toEqual([]);

    // Check result mapping
    expect(jsonMock).toHaveBeenCalled();
    expect(result).toEqual({
      total: 3,
      size: 10,
      results: apiResponse.results,
      lastSort: ['1690000000000', 'doc-1'],
    });
  });

  it('appends searchAfter[] and coerces mixed lastSort to string[]', async () => {
    const apiResponse = {
      total: 5,
      size: 15,
      results: [],
      lastSort: [12345, 'doc-9'], // number -> should become "12345"
    };

    const jsonMock = jest.fn().mockResolvedValue(apiResponse);
    getMock.mockReturnValue({ json: jsonMock });

    const params: MediaESSearchQueryParams = {
      query: 'sunset',
      size: 15,
      exactMatch: true,
      searchAfter: ['1720000000000', 'doc-5'],
    } as const;

    const result = await searchMediaOnESByCursor(params);

    // Check call
    const [, options] = getMock.mock.calls[0];
    expect(options.searchParams).toBeInstanceOf(URLSearchParams);
    const sp: URLSearchParams = options.searchParams;

    expect(sp.get('query')).toBe('sunset');
    expect(sp.get('size')).toBe('15');
    expect(sp.get('exactMatch')).toBe('true');
    expect(sp.getAll('searchAfter[]')).toEqual(['1720000000000', 'doc-5']);

    expect(result.lastSort).toEqual(['12345', 'doc-9']);
    expect(result.total).toBe(5);
    expect(result.size).toBe(15);
    expect(result.results).toEqual([]);
  });

  it('returns empty results array when API does not include `results`', async () => {
    const apiResponse = {
      total: 0,
      size: 20,
    };

    const jsonMock = jest.fn().mockResolvedValue(apiResponse);
    getMock.mockReturnValue({ json: jsonMock });

    const result = await searchMediaOnESByCursor({ size: 20 });

    expect(result).toEqual({
      total: 0,
      size: 20,
      results: [],
      lastSort: undefined,
    });
  });

  it('propagates errors from APIClient.get().json()', async () => {
    const jsonMock = jest.fn().mockRejectedValue(new Error('Network error'));
    getMock.mockReturnValue({ json: jsonMock });

    await expect(searchMediaOnESByCursor({ query: 'x' })).rejects.toThrow('Network error');
  });
});
