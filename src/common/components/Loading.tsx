import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const Loading: React.FC = () => (
  <Box display="flex" justifyContent="center" alignItems="center" p={2}>
    <CircularProgress />
  </Box>
);

export default Loading;