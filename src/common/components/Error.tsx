import React from 'react';
import { Alert } from '@mui/material';

interface ErrorProps { message: string }

const ErrorComponent: React.FC<ErrorProps> = ({ message }) => (
  <Alert severity="error">{message}</Alert>
);

export default ErrorComponent;