import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import SearchBar from './SearchBar';
import PageSizeSelect from './PageSizeSelect';
import PaginationControls from './PaginationControls';
import MediaTable from './MediaTable';
import Loading from '../../../common/components/Loading';
import ErrorComponent from '../../../common/components/Error';
import { searchMedia } from '../../../sevices/mediaApi';
import { MediaResponse } from '../../../types/media';

const MediaSearchPage: React.FC = () => {
  const [query, setQuery] = React.useState('world cup');
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(15);
  const [data, setData] = React.useState<MediaResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

  const handleSortToggle = () => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));

  const sortedResults = React.useMemo(() => {
    if (!data) return [];
    return [...data.results].sort((dt1, dt2) => {
      const dt1Time = new Date(dt1.date).getTime();
      const dt2Time = new Date(dt2.date).getTime();
      return sortOrder === 'asc' ? dt1Time - dt2Time : dt2Time - dt1Time;
    });
  }, [data, sortOrder]);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await searchMedia(query, page, size);
      setData(result);
    } catch (e) {
      setError((e as Error).message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [query, page, size]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

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
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 3 }}>
            <SearchBar
              query={query}
              onSearch={(q) => {
                setQuery(q);
                setPage(1);
              }}
            />
            <PageSizeSelect
              size={size}
              onChange={(newSize) => {
                setSize(newSize);
                setPage(1);
              }}
            />
          </Box>
          {data && <Typography variant="subtitle1">Total Results: {data.total}</Typography>}
        </Box>
        {loading && <Loading />}
        {error && <ErrorComponent message={error} />}
        {data && !loading && !error && (
          <Box>
            <MediaTable
              results={sortedResults}
              sortOrder={sortOrder}
              onSortToggle={handleSortToggle}
            />
            <PaginationControls
              page={data.page}
              total={data.total}
              size={data.size}
              onChange={(newPage) => setPage(newPage)}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MediaSearchPage;
