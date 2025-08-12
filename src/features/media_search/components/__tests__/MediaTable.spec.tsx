// src/features/mediaSearch/__tests__/MediaTable.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import MediaTable from '../../ui/organisms/MediaTable';
import { MediaItem } from '../../../../types/media';

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
  it('renders headers and rows with placeholders', () => {
    render(<MediaTable results={items} sortOrder="asc" onSortToggle={() => {}} />);

    ['ID', 'Title', 'Description', 'Photographer', 'Date', 'Thumbnail'].forEach((h) =>
      expect(screen.getByText(h)).toBeInTheDocument(),
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getAllByText('--')).toHaveLength(1);

    const img = screen.getAllByRole('img')[0] as HTMLImageElement;
    expect(img.src).toContain('/l.jpg');
  });

  it('toggles sort label arrow state', () => {
    const { rerender } = render(
      <MediaTable results={items} sortOrder="asc" onSortToggle={() => {}} />,
    );

    // The <th> cell should carry aria-sort="ascending"
    const headerAsc = screen.getByRole('columnheader', { name: /date/i });
    expect(headerAsc).toHaveAttribute('aria-sort', 'ascending');

    rerender(<MediaTable results={items} sortOrder="desc" onSortToggle={() => {}} />);
    const headerDesc = screen.getByRole('columnheader', { name: /date/i });
    expect(headerDesc).toHaveAttribute('aria-sort', 'descending');
  });
});
