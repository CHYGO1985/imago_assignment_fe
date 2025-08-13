import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { ExactMatchToggle } from '../atoms';
import {
  SearchBar,
  PageSizeSelector,
  CursorPaginationControls,
  DateRangeControls,
} from '../molecules';
import MediaTable from '../organisms/MediaTable';
import { Loading, ErrorComponent } from '../../../../common/components';
import { searchMediaOnESByCursor } from '../../sevices/mediaApi';
import { MediaResponse } from '../../types/media.interface';
import { ISODateString } from '../../types';

type Cursor = string[] | null;

const MediaSearchPage: React.FC = () => {
  const [queryKeyword, setQueryKeyword] = React.useState('');
  const [size, setSize] = React.useState(20);
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

  const [cursorStack, setCursorStack] = React.useState<Cursor[]>([null]); // each entry is the search_after used for that page
  const pageIndex = cursorStack.length - 1;
  const currentCursor = cursorStack[pageIndex];

  // search filters
  const [startDate, setStartDate] = React.useState<ISODateString>('');
  const [endDate, setEndDate] = React.useState<ISODateString>('');
  const [exactMatch, setExactMatch] = React.useState(false);

  const [nextCursor, setNextCursor] = React.useState<string[] | undefined>();
  const [data, setData] = React.useState<MediaResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSortToggle = () => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));

  const fetchPage = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await searchMediaOnESByCursor({
        query: queryKeyword,
        size,
        sortOrder,
        startDate,
        endDate,
        // Omit searchAfter for the first page (null)
        ...(currentCursor ? { searchAfter: currentCursor } : {}),
      });

      setData({ total: res.total, size: res.size, results: res.results });
      setNextCursor(res.lastSort);
    } catch (e) {
      setError((e as Error).message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [queryKeyword, size, sortOrder, currentCursor, startDate, endDate, exactMatch]);

  React.useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  // Reset cursor history whenever inputs that affect ordering change
  React.useEffect(() => {
    setCursorStack([null]);
    setNextCursor(undefined);
  }, [queryKeyword, size, sortOrder]);

  const canPrev = pageIndex > 0;
  const canNext = !!nextCursor && (data?.results?.length ?? 0) === size;

  const goNext = () => {
    if (!canNext || !nextCursor) return;
    setCursorStack((prev) => [...prev, nextCursor]);
  };

  const goPrev = () => {
    if (!canPrev) return;
    setCursorStack((prev) => prev.slice(0, -1));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box p={2}>
        <Typography variant="h4" gutterBottom>
          Media Search
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'baseline',
              gap: 6,
            }}
          >
            <SearchBar
              query={queryKeyword}
              onSearch={(q) => {
                setQueryKeyword(q);
              }}
            />
            <ExactMatchToggle exactMatch={exactMatch} onChange={(value) => setExactMatch(value)} />
          </Box>
          <PageSizeSelector
            size={size}
            onChange={(newSize) => {
              setSize(newSize);
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'baseline',
              gap: '2rem',
              mb: 2,
            }}
          >
            <DateRangeControls
              startDate={startDate}
              endDate={endDate}
              onApply={({ startDate: start, endDate: end }) => {
                setStartDate(start ?? '');
                setEndDate(end ?? '');
                // Reset cursor stack because the filter changed
                setCursorStack([null]);
                setNextCursor(undefined);
              }}
              onClear={() => {
                // Just clears inputs; user still has to click Apply to actually clear filter
              }}
            />
          </Box>
          {data && <Typography variant="subtitle1">Total Results: {data.total}</Typography>}
        </Box>

        {loading && <Loading />}
        {error && <ErrorComponent message={error} />}
        {data && !loading && !error && (
          <Box sx={{ mt: '-2.5rem' }}>
            <MediaTable
              results={data.results}
              sortOrder={sortOrder}
              onSortToggle={handleSortToggle}
            />
            <CursorPaginationControls
              pageIndex={pageIndex}
              canPrev={canPrev}
              canNext={canNext}
              onPrev={goPrev}
              onNext={goNext}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MediaSearchPage;
