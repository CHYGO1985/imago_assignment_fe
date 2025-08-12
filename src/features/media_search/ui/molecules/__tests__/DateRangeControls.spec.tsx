import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DateRangeControls from '../DateRangeControls';

describe('DateRangeControls', () => {
  it('renders with initial values; Apply disabled (unchanged), Clear enabled', () => {
    render(
      <DateRangeControls
        startDate="2024-01-01"
        endDate="2024-02-01"
        onApply={jest.fn()}
        onClear={jest.fn()}
      />,
    );

    expect(screen.getByLabelText(/start date/i)).toHaveValue('2024-01-01');
    expect(screen.getByLabelText(/end date/i)).toHaveValue('2024-02-01');

    expect(screen.getByRole('button', { name: /apply/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /clear/i })).toBeEnabled();
  });

  it('enables Apply when values change and calls onApply with the new range', () => {
    const onApply = jest.fn();

    render(<DateRangeControls startDate="2024-01-01" endDate="2024-02-01" onApply={onApply} />);

    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: '2024-01-05' },
    });
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: '2024-02-10' },
    });

    const applyBtn = screen.getByRole('button', { name: /apply/i });
    expect(applyBtn).toBeEnabled();

    fireEvent.click(applyBtn);
    expect(onApply).toHaveBeenCalledWith({
      startDate: '2024-01-05',
      endDate: '2024-02-10',
    });
  });

  it('shows cross error and disables Apply when only one date is provided', async () => {
    render(<DateRangeControls onApply={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: '2024-01-01' },
    });

    await screen.findByText(/please provide both start and end dates/i);

    expect(screen.getByRole('button', { name: /apply/i })).toBeDisabled();
  });

  it('validates that start date must be before or equal to end date', async () => {
    render(<DateRangeControls onApply={jest.fn()} />);

    fireEvent.change(screen.getByLabelText('Start date', { selector: 'input' }), {
      target: { value: '2024-03-01' },
    });
    fireEvent.change(screen.getByLabelText('End date', { selector: 'input' }), {
      target: { value: '2024-02-01' },
    });

    await screen.findByText(/start date must be before or equal to end date/i);
    expect(screen.getByRole('button', { name: /apply/i })).toBeDisabled();
  });

  it('clears both fields and calls onClear when Clear is clicked', () => {
    const onClear = jest.fn();

    render(
      <DateRangeControls
        startDate="2024-01-01"
        endDate="2024-02-01"
        onApply={jest.fn()}
        onClear={onClear}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /clear/i }));

    expect(screen.getByLabelText(/start date/i)).toHaveValue('');
    expect(screen.getByLabelText(/end date/i)).toHaveValue('');
    expect(onClear).toHaveBeenCalled();
  });

  it('after clearing from non-empty, Apply triggers a "clear filter" onApply call', async () => {
    const onApply = jest.fn();

    render(<DateRangeControls startDate="2024-01-01" endDate="2024-02-01" onApply={onApply} />);

    // Make both empty by clearing manually (simulating user's typing),
    // then Apply should be enabled (changed + no errors) and call with undefineds.
    fireEvent.change(screen.getByLabelText('Start date'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText('End date'), {
      target: { value: '' },
    });

    // Wait for validation cycle
    await waitFor(() => expect(screen.getByRole('button', { name: /apply/i })).toBeEnabled());

    fireEvent.click(screen.getByRole('button', { name: /apply/i }));
    expect(onApply).toHaveBeenCalledWith({
      startDate: undefined,
      endDate: undefined,
    });
  });
});
