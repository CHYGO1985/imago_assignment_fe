import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface PageSizeSelectProps {
  size: number;
  onChange: (newSize: number) => void;
}

const PageSizeSelect: React.FC<PageSizeSelectProps> = ({ size, onChange }) => (
  <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
    <InputLabel>Page Size</InputLabel>
    <Select value={size} onChange={(e) => onChange(Number(e.target.value))} label="Page Size">
      {[5, 10, 15, 20, 50].map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default PageSizeSelect;
