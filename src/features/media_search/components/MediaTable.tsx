import React from 'react';
import { MediaItem } from '../types/media.interface';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  TableSortLabel,
  Tooltip,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;

  let truncated = text.substring(0, maxLength);
  const lastSpacePos = truncated.lastIndexOf(' ');

  return lastSpacePos <= 0
    ? text.substring(0, maxLength) + '...'
    : truncated.substring(0, lastSpacePos) + '...';
};

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  emptyPlaceholder?: string;
}

const TruncatedTextWithTooltip: React.FC<TruncatedTextProps> = ({
  text,
  maxLength = 60,
  emptyPlaceholder = '--',
}) => {
  if (!text?.trim()) {
    return <>{emptyPlaceholder}</>;
  }
  const truncated = truncateText(text, maxLength);

  return truncated !== text ? (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography component="span">{truncated}</Typography>
      <Tooltip title={text} arrow>
        <IconButton size="small" sx={{ ml: 0.5 }}>
          <InfoOutlinedIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </Box>
  ) : (
    <>{text}</>
  );
};

interface MediaTableProps {
  results: MediaItem[];
  sortOrder: 'asc' | 'desc';
  onSortToggle: () => void;
}

const MediaTable: React.FC<MediaTableProps> = ({ results, sortOrder, onSortToggle }) => (
  <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
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
        const largeUrl = item.thumbnailUrl.replace(/\/s\.jpg$/, '/m.jpg');
        const smallUrl = item.thumbnailUrl;

        return (
          <TableRow key={item.id} hover>
            <TableCell>{item.id ?? '--'}</TableCell>
            <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
              <TruncatedTextWithTooltip text={item.title ?? '--'} />
            </TableCell>
            <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
              <TruncatedTextWithTooltip text={item.description ?? '--'} />
            </TableCell>
            <TableCell>{item.photographer ?? '--'}</TableCell>
            <TableCell>
              {new Date(item.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }) ?? '--'}
            </TableCell>
            <TableCell>
              <Link href={largeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={smallUrl}
                  alt={'The media file does not exist'}
                  style={{
                    maxWidth: '100px',
                    height: 'auto',
                    borderRadius: '4px',
                  }}
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
export { TruncatedTextWithTooltip, truncateText }; // Export if needed elsewhere
