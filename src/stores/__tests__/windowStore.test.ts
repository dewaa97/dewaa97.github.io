import { describe, it, expect, beforeEach } from 'vitest';
import { useWindowStore } from '../windowStore';

describe('windowStore', () => {
  beforeEach(() => {
    useWindowStore.setState({
      windows: [],
      activeWindowId: null,
      zIndexCounter: 100,
    });
  });

  it('should open a window', () => {
    const { openWindow } = useWindowStore.getState();
    openWindow('browser', 'Browser');

    const { windows, activeWindowId } = useWindowStore.getState();
    expect(windows).toHaveLength(1);
    expect(windows[0].appId).toBe('browser');
    expect(windows[0].title).toBe('Browser');
    expect(activeWindowId).toBe(windows[0].id);
    expect(windows[0].zIndex).toBe(101);
  });

  it('should close a window', () => {
    const { openWindow, closeWindow } = useWindowStore.getState();
    openWindow('browser', 'Browser');
    
    let state = useWindowStore.getState();
    const windowId = state.windows[0].id;

    closeWindow(windowId);
    
    state = useWindowStore.getState();
    expect(state.windows).toHaveLength(0);
    expect(state.activeWindowId).toBeNull();
  });

  it('should minimize a window', () => {
    const { openWindow, minimizeWindow } = useWindowStore.getState();
    openWindow('browser', 'Browser');
    
    let state = useWindowStore.getState();
    const windowId = state.windows[0].id;

    minimizeWindow(windowId);
    
    state = useWindowStore.getState();
    expect(state.windows[0].isMinimized).toBe(true);
    expect(state.activeWindowId).toBeNull();
  });

  it('should toggle maximize', () => {
    const { openWindow, toggleMaximize } = useWindowStore.getState();
    openWindow('browser', 'Browser');
    
    let state = useWindowStore.getState();
    const windowId = state.windows[0].id;

    toggleMaximize(windowId);
    state = useWindowStore.getState();
    expect(state.windows[0].isMaximized).toBe(true);

    toggleMaximize(windowId);
    state = useWindowStore.getState();
    expect(state.windows[0].isMaximized).toBe(false);
  });

  it('should focus a window and bring it to front', () => {
    const { openWindow, focusWindow } = useWindowStore.getState();
    
    openWindow('browser', 'Browser');
    openWindow('portfolio', 'Portfolio');
    
    let state = useWindowStore.getState();
    const browserId = state.windows[0].id;
    const portfolioId = state.windows[1].id;

    // Initially portfolio is on top because it was opened last
    expect(state.activeWindowId).toBe(portfolioId);
    expect(state.windows[1].zIndex).toBeGreaterThan(state.windows[0].zIndex);

    // Focus browser
    focusWindow(browserId);
    
    state = useWindowStore.getState();
    expect(state.activeWindowId).toBe(browserId);
    // Browser zIndex should be higher now
    const updatedBrowser = state.windows.find(w => w.id === browserId);
    const updatedPortfolio = state.windows.find(w => w.id === portfolioId);
    expect(updatedBrowser!.zIndex).toBeGreaterThan(updatedPortfolio!.zIndex);
  });

  it('should restore minimized window when focused', () => {
    const { openWindow, minimizeWindow, focusWindow } = useWindowStore.getState();
    openWindow('browser', 'Browser');
    
    let state = useWindowStore.getState();
    const windowId = state.windows[0].id;

    minimizeWindow(windowId);
    state = useWindowStore.getState();
    expect(state.windows[0].isMinimized).toBe(true);

    focusWindow(windowId);
    state = useWindowStore.getState();
    expect(state.windows[0].isMinimized).toBe(false);
    expect(state.activeWindowId).toBe(windowId);
  });
});
