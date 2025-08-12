import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import MediaSearchPage from '../MediaSearchPage';
import { searchMediaOnESByCursor } from '../../../components/sevices/mediaApi';
import userEvent from '@testing-library/user-event';

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

jest.mock('../../../components/sevices/mediaApi', () => ({
  __esModule: true,
  searchMediaOnESByCursor: jest.fn(),
}));

// Helpers
const mockItem = (id: string, title: string, date: string) => ({
  id,
  title,
  description: `Desc ${title}`,
  date,
  photographer: 'Someone',
  width: 100,
  height: 100,
  thumbnailUrl: 'https://ex.com/img/s.jpg',
});

describe('<MediaSearchPage />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('shows loading, then renders table and enables Next when a next cursor exists', async () => {
    const makeItem = (i: number) => ({
      id: String(i + 1),
      title: `Item ${i + 1}`,
      description: `Desc ${i + 1}`,
      date: '2024-01-01T00:00:00.000Z',
      photographer: 'P',
      width: 100,
      height: 100,
      thumbnailUrl: 'https://ex.com/img/s.jpg',
    });
    const twenty = Array.from({ length: 20 }, (_, i) => makeItem(i));

    (searchMediaOnESByCursor as jest.Mock).mockResolvedValueOnce({
      total: 40,
      size: 20,
      results: twenty,
      lastSort: ['cursor-1'], // <-- truthy next cursor
    });

    render(<MediaSearchPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    expect(screen.getByText(/Total Results: 40/)).toBeInTheDocument();

    const nextBtn = screen.getByRole('button', { name: /next/i });
    expect(nextBtn).toBeEnabled();
  });

  it('shows error if fetch fails', async () => {
    (searchMediaOnESByCursor as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    render(<MediaSearchPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/Network Error/i)).toBeVisible());
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('performs a new search when the SearchBar submits', async () => {
    (searchMediaOnESByCursor as jest.Mock)
      .mockResolvedValueOnce({
        total: 2,
        size: 20,
        results: [
          mockItem('1', 'A', '2021-01-01T00:00:00.000Z'),
          mockItem('2', 'B', '2022-02-02T00:00:00.000Z'),
        ],
        lastSort: undefined,
      })
      .mockResolvedValueOnce({
        total: 1,
        size: 20,
        results: [mockItem('2', 'B', '2022-02-02T00:00:00.000Z')],
        lastSort: undefined,
      });

    render(<MediaSearchPage />);
    await waitFor(() => screen.getByText(/Total Results: 2/));

    const input = screen.getByLabelText(/search keywords/i);
    fireEvent.change(input, { target: { value: 'new term' } });

    const form = input.closest('form') as HTMLFormElement;
    expect(form).toBeInTheDocument();

    fireEvent.submit(form);

    await waitFor(() => screen.getByText(/Total Results: 1/));
    const lastArgs = (searchMediaOnESByCursor as jest.Mock).mock.calls.at(-1)?.[0] ?? {};
    expect(lastArgs.query).toBe('new term');
  });

  it('toggles sort order via the Date header and refetches', async () => {
    (searchMediaOnESByCursor as jest.Mock)
      // initial (asc): A then B
      .mockResolvedValueOnce({
        total: 2,
        size: 20,
        results: [
          mockItem('1', 'A', '2021-01-01T00:00:00.000Z'),
          mockItem('2', 'B', '2022-02-02T00:00:00.000Z'),
        ],
        lastSort: undefined,
      })
      // after toggle (desc): B then A
      .mockResolvedValueOnce({
        total: 2,
        size: 20,
        results: [
          mockItem('2', 'B', '2022-02-02T00:00:00.000Z'),
          mockItem('1', 'A', '2021-01-01T00:00:00.000Z'),
        ],
        lastSort: undefined,
      });

    render(<MediaSearchPage />);

    // Wait for the table to appear the first time
    const table = await screen.findByRole('table');

    // Initial order
    let rows = within(table).getAllByRole('row').slice(1);
    expect(rows[0]).toHaveTextContent('A');
    expect(rows[1]).toHaveTextContent('B');

    // Click the Date sort label in the table header
    const dateHeader = within(table).getByRole('columnheader', { name: /^date$/i });
    fireEvent.click(within(dateHeader).getByRole('button'));

    // Ensure refetch happened
    await waitFor(() => expect(searchMediaOnESByCursor as jest.Mock).toHaveBeenCalledTimes(2));

    // Wait for the new data to render; re-query the *new* table node
    const tableAfter = await screen.findByRole('table');

    // New order
    const rowsAfter = within(tableAfter).getAllByRole('row').slice(1);
    expect(rowsAfter[0]).toHaveTextContent('B');
    expect(rowsAfter[1]).toHaveTextContent('A');

    // Assert the API was called with desc
    const secondArgs = (searchMediaOnESByCursor as jest.Mock).mock.calls[1][0];
    expect(secondArgs.sortOrder).toBe('desc');
  });

  it('applies a date range via DateRangeControls and refetches with those params', async () => {
    (searchMediaOnESByCursor as jest.Mock)
      .mockResolvedValueOnce({
        total: 2,
        size: 20,
        results: [
          mockItem('1', 'A', '2021-01-01T00:00:00.000Z'),
          mockItem('2', 'B', '2022-02-02T00:00:00.000Z'),
        ],
        lastSort: undefined,
      })
      .mockResolvedValueOnce({
        total: 2,
        size: 20,
        results: [
          mockItem('1', 'A', '2021-01-01T00:00:00.000Z'),
          mockItem('2', 'B', '2022-02-02T00:00:00.000Z'),
        ],
        lastSort: undefined,
      });

    render(<MediaSearchPage />);
    await waitFor(() => screen.getByText(/Total Results: 2/));

    // Set date range
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: '2021-01-01' },
    });
    fireEvent.change(screen.getByLabelText('End date'), {
      target: { value: '2021-12-31' },
    });

    // The page also has a SearchBar "Apply", so click the *second* "Apply" (DateRangeControls)
    const applyButtons = screen.getAllByRole('button', { name: /apply/i });
    fireEvent.click(applyButtons[applyButtons.length - 1]);

    await waitFor(() => expect(searchMediaOnESByCursor as jest.Mock).toHaveBeenCalledTimes(2));

    const lastArgs = (searchMediaOnESByCursor as jest.Mock).mock.calls.at(-1)?.[0] || {};
    expect(lastArgs.startDate).toBe('2021-01-01');
    expect(lastArgs.endDate).toBe('2021-12-31');
  });
});
