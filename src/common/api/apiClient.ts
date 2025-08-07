import ky from 'ky';

/**
 * Shared HTTP client for all API calls.
 * - Base URL: /api/v1
 * - 10s timeout
 * - Retries GET requests up to 2 times on common server/network errors
 */
export const APIClient = ky.create({
  prefixUrl: '/api/v1',
  timeout: 10_000,
  retry: {
    limit: 2,
    methods: ['get'], // Only retry GET requests
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
});
