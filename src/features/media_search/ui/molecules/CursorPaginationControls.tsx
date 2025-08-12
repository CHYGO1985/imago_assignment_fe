import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface Props {
  pageIndex: number;         // 0-based, derived from cursor stack
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const CursorPaginationControls: React.FC<Props> = ({
  pageIndex,
  canPrev,
  canNext,
  onPrev,
  onNext,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
      <Button variant="outlined" onClick={onPrev} disabled={!canPrev}>
        Prev
      </Button>
      <Button variant="outlined" onClick={onNext} disabled={!canNext}>
        Next
      </Button>
      <Typography variant="body2" sx={{ ml: 1 }}>
        Page {pageIndex + 1}
      </Typography>
    </Box>
  );
};

export default CursorPaginationControls;
