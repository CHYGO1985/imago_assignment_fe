// src/features/media_search/components/DateRangeControls.tsx
import React from 'react';
import { Box, TextField, Button, Tooltip } from '@mui/material';
import { parseISO, isValid as isValidDate, isAfter, format } from 'date-fns';

type Props = {
  // Currently applied values (for disabling Apply when unchanged)
  startDate?: string; // 'YYYY-MM-DD'
  endDate?: string; // 'YYYY-MM-DD'
  onApply: (range: { startDate?: string; endDate?: string }) => void;
  onClear?: () => void;
};

const toISODate = (d: Date) => format(d, 'yyyy-MM-dd');

const DateRangeControls: React.FC<Props> = ({ startDate, endDate, onApply, onClear }) => {
  // Local, editable inputs
  const [localStart, setLocalStart] = React.useState<string>(startDate ?? '');
  const [localEnd, setLocalEnd] = React.useState<string>(endDate ?? '');
  const [errors, setErrors] = React.useState<{ start?: string; end?: string; cross?: string }>({});

  // Keep local fields in sync if parent resets them (e.g., Clear, new search, etc.)
  React.useEffect(() => {
    setLocalStart(startDate ?? '');
  }, [startDate]);
  React.useEffect(() => {
    setLocalEnd(endDate ?? '');
  }, [endDate]);

  const validate = React.useCallback(() => {
    const nextErrors: typeof errors = {};

    // Both optional, but if one is present, the other must be present to apply
    if (localStart) {
      const d = parseISO(localStart);
      if (!isValidDate(d)) nextErrors.start = 'Invalid start date';
    }
    if (localEnd) {
      const d = parseISO(localEnd);
      if (!isValidDate(d)) nextErrors.end = 'Invalid end date';
    }

    if (localStart && localEnd) {
      const s = parseISO(localStart);
      const e = parseISO(localEnd);
      if (isValidDate(s) && isValidDate(e) && isAfter(s, e)) {
        nextErrors.cross = 'Start date must be before or equal to end date';
      }
    }

    // If user provided only one side, we require both to apply
    if ((localStart && !localEnd) || (!localStart && localEnd)) {
      nextErrors.cross = 'Please provide both start and end dates';
    }

    setErrors(nextErrors);
    return nextErrors;
  }, [localStart, localEnd]);

  React.useEffect(() => {
    validate();
  }, [validate]);

  const unchanged = (startDate ?? '') === localStart && (endDate ?? '') === localEnd;

  const hasErrors = Boolean(errors.start || errors.end || errors.cross);

  const onClickApply = () => {
    const v = validate();
    if (v.start || v.end || v.cross) return;

    if (!localStart && !localEnd) {
      // Nothing set => treat as clearing filter
      onApply({ startDate: undefined, endDate: undefined });
      return;
    }
    onApply({ startDate: localStart || undefined, endDate: localEnd || undefined });
  };

  const onClickClear = () => {
    setLocalStart('');
    setLocalEnd('');
    onClear?.();
    // Do NOT auto-apply; user must click Apply to trigger the search
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'baseline', flexWrap: 'wrap' }}>
      <TextField
        label="Start date"
        type="date"
        value={localStart}
        onChange={(e) => setLocalStart(e.target.value)}
        error={!!errors.start}
        helperText={errors.start || ' '}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            sx: {
              height: 44,
              '& input': {
                height: '100%',
                padding: 2,
                boxSizing: 'border-box',
              },
            },
            inputProps: { placeholder: 'YYYY-MM-DD' },
          },
        }}
      />
      <TextField
        label="End date"
        type="date"
        value={localEnd}
        onChange={(e) => setLocalEnd(e.target.value)}
        error={!!errors.end}
        helperText={errors.end || ' '}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            sx: {
              height: 44,
              '& input': {
                height: '100%',
                padding: 2,
                boxSizing: 'border-box',
              },
            },
            inputProps: { placeholder: 'YYYY-MM-DD' },
          },
        }}
      />

      <Tooltip title={errors.cross ? errors.cross : ''} placement="top" open={!!errors.cross}>
        <span>
          <Button variant="contained" onClick={onClickApply} disabled={hasErrors || unchanged}>
            Apply
          </Button>
        </span>
      </Tooltip>

      <Button variant="text" onClick={onClickClear} disabled={!localStart && !localEnd}>
        Clear
      </Button>
    </Box>
  );
};

export default DateRangeControls;
