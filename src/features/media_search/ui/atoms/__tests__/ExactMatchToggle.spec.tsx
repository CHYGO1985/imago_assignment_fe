import { render, screen, fireEvent } from '@testing-library/react';
import ExactMatchToggle from '../ExactMatchToggle';

describe('ExactMatchToggle', () => {
  it('renders with label and initial checked state (true)', () => {
    render(<ExactMatchToggle exactMatch={true} onChange={jest.fn()} />);
    const toggle = screen.getByRole('switch', { name: /exact keywords match/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toBeChecked();
  });

  it('renders with label and initial unchecked state (false)', () => {
    render(<ExactMatchToggle exactMatch={false} onChange={jest.fn()} />);
    const toggle = screen.getByRole('switch', { name: /exact keywords match/i });
    expect(toggle).not.toBeChecked();
  });

  it('calls onChange with true when switched on', () => {
    const onChange = jest.fn();
    render(<ExactMatchToggle exactMatch={false} onChange={onChange} />);
    const toggle = screen.getByRole('switch', { name: /exact keywords match/i });
    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when switched off', () => {
    const onChange = jest.fn();
    render(<ExactMatchToggle exactMatch={true} onChange={onChange} />);
    const toggle = screen.getByRole('switch', { name: /exact keywords match/i });
    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('toggles via the label as well', () => {
    const onChange = jest.fn();
    render(<ExactMatchToggle exactMatch={false} onChange={onChange} />);
    const toggle = screen.getByLabelText(/exact keywords match/i);
    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
