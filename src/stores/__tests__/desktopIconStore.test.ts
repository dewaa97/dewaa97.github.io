import { describe, it, expect, beforeEach } from 'vitest';
import { useDesktopIconStore } from '../desktopIconStore';

describe('desktopIconStore', () => {
  beforeEach(() => {
    useDesktopIconStore.setState({
      positions: {},
    });
  });

  it('should set icon position and round values', () => {
    const { setIconPosition } = useDesktopIconStore.getState();
    setIconPosition('browser', { x: 10.2, y: 20.7 });
    const { positions } = useDesktopIconStore.getState();
    expect(positions.browser).toEqual({ x: 10, y: 21 });
  });

  it('should reset positions', () => {
    const { setIconPosition, resetPositions } = useDesktopIconStore.getState();
    setIconPosition('settings', { x: 44, y: 88 });
    resetPositions();
    const { positions } = useDesktopIconStore.getState();
    expect(positions).toEqual({});
  });
});

