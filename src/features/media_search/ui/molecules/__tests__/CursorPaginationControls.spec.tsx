import { render, screen, fireEvent } from '@testing-library/react';
import CursorPaginationControls from '../CursorPaginationControls';

describe('CursorPaginationControls', () => {
  const setup = (
    overrideProps: Partial<React.ComponentProps<typeof CursorPaginationControls>> = {},
  ) => {
    const props = {
      pageIndex: 0,
      canPrev: false,
      canNext: true,
      onPrev: jest.fn(),
      onNext: jest.fn(),
      ...overrideProps,
    };
    render(<CursorPaginationControls {...props} />);
    return props;
  };

  it('renders Prev/Next buttons and shows the page number (pageIndex + 1)', () => {
    setup({ pageIndex: 2, canPrev: false, canNext: true });
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
    expect(screen.getByText(/page 3/i)).toBeInTheDocument();
  });

  it('enables/disables buttons based on props', () => {
    setup({ canPrev: true, canNext: true });
    expect(screen.getByRole('button', { name: /prev/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
  });

  it('calls onNext when Next is clicked and enabled', () => {
    const props = setup({ canNext: true });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(props.onNext).toHaveBeenCalledTimes(1);
  });

  it('does not call onNext when Next is disabled', () => {
    const props = setup({ canNext: false });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(props.onNext).not.toHaveBeenCalled();
  });

  it('calls onPrev when Prev is clicked and enabled', () => {
    const props = setup({ canPrev: true });
    fireEvent.click(screen.getByRole('button', { name: /prev/i }));
    expect(props.onPrev).toHaveBeenCalledTimes(1);
  });

  it('does not call onPrev when Prev is disabled', () => {
    const props = setup({ canPrev: false });
    fireEvent.click(screen.getByRole('button', { name: /prev/i }));
    expect(props.onPrev).not.toHaveBeenCalled();
  });
});
