import { render, screen } from '@testing-library/react';
import { WindowManager } from '../WindowManager';
import { useAppStore } from '@/stores/appStore';
import { useWindowStore } from '@/stores/windowStore';
import { initialApps } from '@/config/apps';
import { describe, it, expect, beforeEach } from 'vitest';

describe('WindowManager', () => {
  beforeEach(() => {
    useAppStore.setState({ apps: {} });
    useWindowStore.setState({ windows: [], activeWindowId: null });

    const { registerApp } = useAppStore.getState();
    initialApps.forEach(app => registerApp(app));
  });

  it('renders nothing when no windows are open', () => {
    const { container } = render(<WindowManager />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('renders an open window', () => {
    const { openWindow } = useWindowStore.getState();
    openWindow('portfolio', 'Resume');

    render(<WindowManager />);
    
    // Check if PortfolioApp content is rendered
    expect(screen.getByText('Experience')).toBeInTheDocument();
    // Check if Window title is rendered
    expect(screen.getByText('Resume')).toBeInTheDocument();
  });

  it('renders multiple windows', () => {
    const { openWindow } = useWindowStore.getState();
    openWindow('portfolio', 'Resume');
    openWindow('web3', 'Web3');

    render(<WindowManager />);
    
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('MetaMask Blockchain Education')).toBeInTheDocument();
  });
});
