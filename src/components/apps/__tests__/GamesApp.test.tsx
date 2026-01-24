import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GamesApp } from '../GamesApp';

describe('GamesApp', () => {
  it('renders game list', () => {
    render(<GamesApp />);
    expect(screen.getByText('Snake')).toBeInTheDocument();
    expect(screen.getByText('Pacman')).toBeInTheDocument();
    expect(screen.getByText('Dino Runner')).toBeInTheDocument();
    expect(screen.getByText('Tic-tac-toe')).toBeInTheDocument();
    expect(screen.getByText('Memory')).toBeInTheDocument();
  });

  it('switches to a selected game', () => {
    render(<GamesApp />);
    fireEvent.click(screen.getByText('Tic-tac-toe'));
    expect(screen.getByText(/Turn:/i)).toBeInTheDocument();
  });
});

