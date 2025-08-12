import { render, screen, fireEvent, within } from '@testing-library/react';
import MediaTable from '../MediaTable';
import { MediaItem } from '../../../../../types/media';

const items: MediaItem[] = [
  {
    id: '1',
    title: 'Hello',
    description: '',
    date: '2021-01-01T00:00:00.000Z',
    photographer: 'Alice',
    width: 100,
    height: 100,
    thumbnailUrl: 'https://ex.com/img/s.jpg',
  },
  {
    id: '2',
    title: '',
    description: 'Desc',
    date: '',
    photographer: '',
    width: 100,
    height: 100,
    thumbnailUrl: 'https://ex.com/img/s.jpg',
  },
];

describe('MediaTable', () => {
  it('renders headers and rows', () => {
    render(<MediaTable results={items} sortOrder="asc" onSortToggle={() => {}} />);

    ['ID', 'Title', 'Description', 'Photographer', 'Date', 'Thumbnail'].forEach((h) =>
      expect(screen.getByText(h)).toBeInTheDocument(),
    );

    const rowgroups = screen.getAllByRole('rowgroup');
    const tbody = rowgroups[1];
    const rows = within(tbody).getAllByRole('row');
    expect(rows).toHaveLength(2);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('shows placeholders only where TruncatedTextWithTooltip is used', () => {
    render(<MediaTable results={items} sortOrder="asc" onSortToggle={() => {}} />);

    const placeholders = screen.getAllByText('--');
    expect(placeholders).toHaveLength(2);

    expect(screen.getByText(/invalid date/i)).toBeInTheDocument();

    // Photographer empty string renders empty cell (no "--")
    // We won't assert exact empty cell text, just ensure no extra placeholders exist
  });

  it('uses small image for <img> and links to medium image', () => {
    render(<MediaTable results={items} sortOrder="asc" onSortToggle={() => {}} />);

    const imgs = screen.getAllByRole('img', { name: /the media file does not exist/i });
    expect(imgs[0]).toHaveAttribute('src', expect.stringContaining('/s.jpg'));

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', expect.stringContaining('/m.jpg'));
  });

  it('reflects sort order via aria-sort on the Date column header', () => {
    const { rerender } = render(
      <MediaTable results={items} sortOrder="asc" onSortToggle={() => {}} />,
    );

    const headerAsc = screen.getByRole('columnheader', { name: /date/i });
    expect(headerAsc).toHaveAttribute('aria-sort', 'ascending');

    rerender(<MediaTable results={items} sortOrder="desc" onSortToggle={() => {}} />);
    const headerDesc = screen.getByRole('columnheader', { name: /date/i });
    expect(headerDesc).toHaveAttribute('aria-sort', 'descending');
  });

  it('calls onSortToggle when the Date sort label is clicked', () => {
    const onSortToggle = jest.fn();
    render(<MediaTable results={items} sortOrder="asc" onSortToggle={onSortToggle} />);

    fireEvent.click(screen.getByRole('button', { name: /date/i }));
    expect(onSortToggle).toHaveBeenCalledTimes(1);
  });
});
