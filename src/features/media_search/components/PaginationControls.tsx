import React from 'react';
import { Pagination } from '@mui/material';

interface PaginationControlsProps {
  page: number;
  total: number;
  size: number;
  onChange: (newPage: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ page, total, size, onChange }) => {
  const pageCount = Math.ceil(total / size);

  return (
    <Pagination
      count={pageCount}
      page={page}
      onChange={(e, value) => onChange(value)}
      color="primary"
      showFirstButton
      showLastButton
      sx={{ my: 2 }}
    />
  );
};

export default PaginationControls;
