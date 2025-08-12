import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import MediaSearchPage from '../MediaSearchPage';
import * as api from '../sevices/mediaApi';
import { MediaResponse } from '../../../../types/media';

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

jest.mock('../../../../sevices/mediaApi');
const mockSearch = api as jest.Mocked<typeof api>;

const mockData: MediaResponse = {
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
    mockSearch.searchMedia.mockResolvedValueOnce(mockData);

    render(<MediaSearchPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    expect(screen.getByText(/Total Results: 2/)).toBeInTheDocument();

    const table = screen.getByRole('table');
    expect(within(table).getByText('1')).toBeInTheDocument();
    expect(within(table).getByText('2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
  });

  it('shows error if fetch fails', async () => {
    mockSearch.searchMedia.mockRejectedValueOnce(new Error('Network Error'));

    render(<MediaSearchPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Network Error/)).toBeVisible();
    });
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('performs a new search when query is submitted', async () => {
    mockSearch.searchMedia.mockResolvedValueOnce(mockData).mockResolvedValueOnce({
      ...mockData,
      results: [{ ...mockData.results[1] }],
      total: 1,
    });

    render(<MediaSearchPage />);
    await waitFor(() => screen.getByText(/Total Results: 2/));
    const input = screen.getByLabelText(/search/i);
    fireEvent.change(input, { target: { value: 'new term' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => screen.getByText(/Total Results: 1/));

    const tableAfter = screen.getByRole('table');
    expect(within(tableAfter).queryByText('1')).toBeNull();
    expect(within(tableAfter).getByText('2')).toBeInTheDocument();
  });

  it('toggles sort order when clicking the Date header', async () => {
    mockSearch.searchMedia.mockResolvedValueOnce(mockData);

    render(<MediaSearchPage />);

    await waitFor(() => screen.getByText('A'));

    const rowsAsc = screen.getAllByRole('row').slice(1);
    expect(rowsAsc[0]).toHaveTextContent('A');
    expect(rowsAsc[1]).toHaveTextContent('B');

    fireEvent.click(screen.getByText('Date'));

    const rowsDesc = screen.getAllByRole('row').slice(1);
    expect(rowsDesc[0]).toHaveTextContent('B');
    expect(rowsDesc[1]).toHaveTextContent('A');
  });
});
