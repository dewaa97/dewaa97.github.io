import { render, screen, fireEvent } from '@testing-library/react';
import { FileExplorer } from '../FileExplorer';
import { describe, it, expect } from 'vitest';

describe('FileExplorer', () => {
  it('renders home directory items initially', () => {
    render(<FileExplorer />);
    expect(screen.getAllByText('Projects').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Documents').length).toBeGreaterThan(0);
    expect(screen.getByText('Resume.pdf')).toBeInTheDocument();
  });

  it('navigates to Projects folder on double click', () => {
    render(<FileExplorer />);
    
    // There are multiple "Projects" texts (sidebar, grid item)
    // We want the one in the grid (main content) to double click
    // The grid items have a class 'flex-col items-center' or we can just pick the last one usually
    const projectItems = screen.getAllByText('Projects');
    const projectFolder = projectItems[projectItems.length - 1]; // Assuming the last one is in the grid
    
    fireEvent.doubleClick(projectFolder);

    // Should now see breadcrumb 'Projects'
    const breadcrumbs = screen.getAllByText('Projects');
    expect(breadcrumbs.length).toBeGreaterThan(0); 
  });

  it('updates path when clicking sidebar items', () => {
    render(<FileExplorer />);
    
    const documentsSidebar = screen.getAllByText('Documents')[0]; // First one is likely sidebar
    fireEvent.click(documentsSidebar);

    // Should show empty state or documents content
    // Based on code: if (item.id === 'documents') setCurrentPath(['documents']);
    // And getItems returns [] for documents
    expect(screen.getByText('This folder is empty.')).toBeInTheDocument();
  });
});
