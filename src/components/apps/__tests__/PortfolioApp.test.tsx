import { render, screen } from '@testing-library/react';
import { PortfolioApp } from '../PortfolioApp';
import { describe, it, expect, vi } from 'vitest';

// Mock the json data
vi.mock('@/data/portfolio.json', () => ({
  default: {
    personalInfo: {
      name: 'Test User',
      title: 'Test Title',
      bio: 'Test Bio',
      photo: 'test.jpg'
    },
    experience: [
      {
        id: '1',
        company: 'Test Company',
        position: 'Test Position',
        startDate: '2020',
        endDate: 'Present',
        description: 'Test Description',
        technologies: ['React']
      }
    ],
    skills: [
      {
        name: 'React',
        level: 90
      }
    ]
  }
}));

describe('PortfolioApp', () => {
  it('renders personal info', () => {
    render(<PortfolioApp />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Bio')).toBeInTheDocument();
  });

  it('renders experience section', () => {
    render(<PortfolioApp />);
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Test Position')).toBeInTheDocument();
    expect(screen.getByText('Test Company • 2020 - Present')).toBeInTheDocument();
  });

  it('renders skills section', () => {
    render(<PortfolioApp />);
    expect(screen.getByText('Skills')).toBeInTheDocument();
    
    // React might appear in Experience too, so we check if at least one exists
    const reactElements = screen.getAllByText('React');
    expect(reactElements.length).toBeGreaterThan(0);
  });
});
