import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserApp } from '../BrowserApp';
import { describe, it, expect, vi } from 'vitest';

// Mock window.open since it's not available in jsdom
const mockOpen = vi.fn();
window.open = mockOpen;

describe('BrowserApp', () => {
  it('renders with default URL', () => {
    render(<BrowserApp />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('https://example.com');
  });

  it('updates input value on change', () => {
    render(<BrowserApp />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'google.com' } });
    expect(input).toHaveValue('google.com');
  });

  it('updates iframe src on form submit', () => {
    render(<BrowserApp />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'https://test.com' } });
    fireEvent.submit(input.closest('form')!);

    const iframe = screen.getByTitle('Browser');
    expect(iframe).toHaveAttribute('src', 'https://test.com');
  });

  it('adds https protocol automatically', () => {
    render(<BrowserApp />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test.com' } });
    fireEvent.submit(input.closest('form')!);

    const iframe = screen.getByTitle('Browser');
    expect(iframe).toHaveAttribute('src', 'https://test.com');
  });

  it('opens new tab when external link button is clicked', () => {
    render(<BrowserApp />);
    const externalLinkBtn = screen.getByTitle('Open in new tab');
    
    fireEvent.click(externalLinkBtn);
    expect(mockOpen).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
  });

  it('handles flyingcape.com.sg URL correctly', () => {
    render(<BrowserApp />);
    const input = screen.getByRole('textbox');
    
    // Simulate typing the URL that causes issues
    fireEvent.change(input, { target: { value: 'flyingcape.com.sg' } });
    fireEvent.submit(input.closest('form')!);

    const iframe = screen.getByTitle('Browser');
    // It should set the src correctly
    expect(iframe).toHaveAttribute('src', 'https://flyingcape.com.sg');
    
    // The iframe itself might still fail to load content due to X-Frame-Options (which we can't test in jsdom easily)
    // But we can verify the app logic doesn't crash React
    // And check if the "Can't display this website here" text is present (which is the friendly error message)
    expect(screen.getByText(/Can't display this website here/i)).toBeInTheDocument();
  });
});
