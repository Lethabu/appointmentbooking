import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/Footer';

describe('Footer', () => {
  it('renders the footer with the correct text', () => {
    render(<Footer />);
    const footerText = screen.getByText(/The complete salon booking and management platform/i);
    expect(footerText).toBeInTheDocument();
  });
});
