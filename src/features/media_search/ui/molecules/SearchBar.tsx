import React from 'react';
import { TextField, Button, Box } from '@mui/material';

interface SearchBarProps {
  query: string;
  onSearch: (newQuery: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, onSearch }) => {
  const [value, setValue] = React.useState(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <Box component="form" onSubmit={handleSubmit} display="flex" alignItems="center" mb={2}>
      <TextField
        label="Search Keywords"
        variant="outlined"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        size="small"
      />
      <Button type="submit" variant="contained" sx={{ ml: 2 }}>
        Apply
      </Button>
    </Box>
  );
};

export default SearchBar;
