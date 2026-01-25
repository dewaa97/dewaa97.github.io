import { render, screen, fireEvent } from '@testing-library/react';
import { FileExplorer } from '../FileExplorer';
import { describe, it, expect } from 'vitest';

describe('FileExplorer', () => {
  it('renders home directory items initially', () => {
    render(<FileExplorer />);
    expect(screen.getAllByText('Learning').length).toBeGreaterThan(0);
  });

  it('navigates to Learning folder on double click', () => {
    render(<FileExplorer />);

    const learningItems = screen.getAllByText('Learning');
    const learningFolder = learningItems[learningItems.length - 1];
    fireEvent.doubleClick(learningFolder);

    const breadcrumbs = screen.getAllByText('Learning');
    expect(breadcrumbs.length).toBeGreaterThan(0);
    expect(screen.getByText('Project Management')).toBeInTheDocument();
  });

  it('navigates via breadcrumb home button', () => {
    render(<FileExplorer />);

    const learningItems = screen.getAllByText('Learning');
    const learningFolder = learningItems[learningItems.length - 1];
    fireEvent.doubleClick(learningFolder);
    expect(screen.getByText('Project Management')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Go to Home'));
    const learningAfter = screen.getAllByText('Learning');
    expect(learningAfter.length).toBeGreaterThan(0);
  });

  it('updates path when clicking sidebar items', () => {
    render(<FileExplorer />);

    const learningSidebar = screen.getAllByText('Learning')[0];
    fireEvent.click(learningSidebar);
    expect(screen.getByText('Project Management')).toBeInTheDocument();
  });
});
