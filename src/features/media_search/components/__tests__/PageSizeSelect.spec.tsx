import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PageSizeSelector from '../../ui/molecules/PageSizeSelector';

describe('PageSizeSelect', () => {
  it('renders with the current size and calls onChange when a new size is selected', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<PageSizeSelector size={15} onChange={handleChange} />);

    // Grab the combobox by its label
    const select = screen.getByRole('combobox');
    expect(select).toHaveTextContent('15');

    await user.click(select);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();

    const option20 = screen.getByRole('option', { name: '20' });
    await user.click(option20);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(20);
  });
});
