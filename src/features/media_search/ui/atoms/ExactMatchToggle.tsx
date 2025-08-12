import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';

type Props = {
  exactMatch: boolean;
  onChange: (value: boolean) => void;
};

const ExactMatchToggle: React.FC<Props> = ({ exactMatch, onChange }) => {
  return (
    <FormControlLabel
      control={<Switch checked={exactMatch} onChange={(e) => onChange(e.target.checked)} />}
      label="Exact match"
    />
  );
};

export default ExactMatchToggle;
