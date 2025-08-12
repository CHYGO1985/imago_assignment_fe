import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../../ui/molecules/SearchBar';

describe('SearchBar', () => {
  it('renders the input and button with initial value', () => {
    render(<SearchBar query="foo" onSearch={jest.fn()} />);
    expect(screen.getByLabelText(/search/i)).toHaveValue('foo');
    expect(screen.getByRole('button', { name: /search/i })).toBeEnabled();
  });

  it('calls onSearch with trimmed value on submit', () => {
    const onSearch = jest.fn();
    render(<SearchBar query="foo" onSearch={onSearch} />);
    const input = screen.getByLabelText(/search/i);
    fireEvent.change(input, { target: { value: '  bar  ' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSearch).toHaveBeenCalledWith('bar');
  });
});
