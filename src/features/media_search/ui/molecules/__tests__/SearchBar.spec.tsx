import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('renders the input and button with initial value', () => {
    render(<SearchBar query="foo" onSearch={jest.fn()} />);
    expect(screen.getByLabelText(/search keywords/i)).toHaveValue('foo');
    expect(screen.getByRole('button', { name: /apply/i })).toBeEnabled();
  });

  it('calls onSearch with trimmed value on submit', () => {
    const onSearch = jest.fn();
    render(<SearchBar query="foo" onSearch={onSearch} />);
    const input = screen.getByLabelText(/search keywords/i);
    fireEvent.change(input, { target: { value: '  bar  ' } });
    fireEvent.click(screen.getByRole('button', { name: /apply/i }));
    expect(onSearch).toHaveBeenCalledWith('bar');
  });
});
