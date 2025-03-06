import { render, screen } from '@testing-library/react';
import NotFoundPage from '@/pages/news/404';
import { describe, it } from 'node:test';

describe('404 Page', () => {
  it('renders a heading with the text "Not Found"', () => {
    render(<NotFoundPage />);
    const heading = screen.getByText(/not found/i);
    expect(heading).toBeInTheDocument();
  });
});
