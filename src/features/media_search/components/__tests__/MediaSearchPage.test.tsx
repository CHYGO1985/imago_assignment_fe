// src/features/media_search/components/__tests__/MediaSearchPage.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import MediaSearchPage from '../MediaSearchPage';
import * as api from '../../../../sevices/mediaApi';
import { MediaResponse } from '../../../../types/media';

// Fully mock ky so .create().get().json() uses our spies
jest.mock('ky', () => {
  const mockJson = jest.fn().mockResolvedValue({});
  const mockGet = jest.fn().mockReturnValue({ json: mockJson });
  const mockKyInstance = { get: mockGet };

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockKyInstance),
    },
  };
});

// mock out our own API wrapper
jest.mock('../../../../sevices/mediaApi');
const mockSearch = api as jest.Mocked<typeof api>;

const fakeData: MediaResponse = {
  total: 2,
  page: 1,
  size: 15,
  results: [
    {
      id: '1',
      title: 'A',
      description: 'Desc A',
      date: '2021-01-01T00:00:00.000Z',
      photographer: 'Alice',
      width: 100,
      height: 100,
      thumbnailUrl: 'https://ex.com/img/s.jpg',
    },
    {
      id: '2',
      title: 'B',
      description: 'Desc B',
      date: '2022-02-02T00:00:00.000Z',
      photographer: 'Bob',
      width: 100,
      height: 100,
      thumbnailUrl: 'https://ex.com/img/s.jpg',
    },
  ],
};

describe('<MediaSearchPage />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('shows loading, then renders table and pagination on success', async () => {
    mockSearch.searchMedia.mockResolvedValueOnce(fakeData);

    render(<MediaSearchPage />);

    // initial loading spinner
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // wait for fetch to finish
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    // should show total count
    expect(screen.getByText(/Total Results: 2/)).toBeInTheDocument();

    // now scope our "1" and "2" assertions to the table only
    const table = screen.getByRole('table');
    expect(within(table).getByText('1')).toBeInTheDocument();
    expect(within(table).getByText('2')).toBeInTheDocument();

    // pagination controls present
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
  });

  it('shows error if fetch fails', async () => {
    mockSearch.searchMedia.mockRejectedValueOnce(new Error('Network Error'));

    render(<MediaSearchPage />);

    // spinner first
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // then error alert
    await waitFor(() => {
      expect(screen.getByText(/Network Error/)).toBeVisible();
    });

    // no table rendered
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('performs a new search when query is submitted', async () => {
    mockSearch.searchMedia
      .mockResolvedValueOnce(fakeData) // initial load
      .mockResolvedValueOnce({
        // after new search
        ...fakeData,
        results: [{ ...fakeData.results[1] }], // only B
        total: 1,
      });

    render(<MediaSearchPage />);

    // wait initial
    await waitFor(() => screen.getByText(/Total Results: 2/));

    // change search input
    const input = screen.getByLabelText(/search/i);
    fireEvent.change(input, { target: { value: 'new term' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    // should show loading again
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // after search, only one result
    await waitFor(() => screen.getByText(/Total Results: 1/));

    // scope again to the table—there should be no '1' cell now
    const tableAfter = screen.getByRole('table');
    expect(within(tableAfter).queryByText('1')).toBeNull();
    expect(within(tableAfter).getByText('2')).toBeInTheDocument();
  });

  it('toggles sort order when clicking the Date header', async () => {
    mockSearch.searchMedia.mockResolvedValueOnce(fakeData);

    render(<MediaSearchPage />);

    // wait data
    await waitFor(() => screen.getByText('A'));

    // initial order asc => A then B
    const rowsAsc = screen.getAllByRole('row').slice(1);
    expect(rowsAsc[0]).toHaveTextContent('A');
    expect(rowsAsc[1]).toHaveTextContent('B');

    // click sort
    fireEvent.click(screen.getByText('Date'));

    // now desc => B then A
    const rowsDesc = screen.getAllByRole('row').slice(1);
    expect(rowsDesc[0]).toHaveTextContent('B');
    expect(rowsDesc[1]).toHaveTextContent('A');
  });
});
