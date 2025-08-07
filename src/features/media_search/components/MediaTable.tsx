import React from 'react';
import { MediaItem } from '../../../types/media';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  TableSortLabel,
} from '@mui/material';

interface MediaTableProps {
  results: MediaItem[];
  sortOrder: 'asc' | 'desc';
  onSortToggle: () => void;
}

const MediaTable: React.FC<MediaTableProps> = ({ results, sortOrder, onSortToggle }) => (
  <Table
    sx={{
      tableLayout: 'fixed', // force equal distribution
      width: '100%',
    }}
  >
    <TableHead>
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>Title</TableCell>
        <TableCell>Description</TableCell>
        <TableCell>Photographer</TableCell>
        <TableCell sortDirection={sortOrder}>
          <TableSortLabel active direction={sortOrder} onClick={onSortToggle}>
            Date
          </TableSortLabel>
        </TableCell>
        <TableCell>Thumbnail</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {results.map((item) => {
        const largeUrl = item.thumbnailUrl.replace(/\/s\.jpg$/, '/l.jpg');
        const smallUrl = item.thumbnailUrl;
        return (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell
              sx={{
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                maxWidth: 600,
              }}
            >
              {item.title}
            </TableCell>
            <TableCell
              sx={{
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                maxWidth: 1000,
              }}
            >
              {item.description?.trim() ? item.description : '--'}
            </TableCell>
            <TableCell>{item.photographer}</TableCell>
            <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <Link href={smallUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={largeUrl}
                  alt={item.title}
                  style={{ maxWidth: '100px', height: 'auto' }}
                />
              </Link>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
);

export default MediaTable;
