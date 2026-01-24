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

  it('should clean up icons into a grid', () => {
    const { cleanUpIcons } = useDesktopIconStore.getState();
    cleanUpIcons(['a', 'b', 'c', 'd', 'e'], { width: 500, height: 500 });
    const { positions } = useDesktopIconStore.getState();
    expect(positions.a).toEqual({ x: 16, y: 16 });
    expect(positions.b).toEqual({ x: 16, y: 120 });
    expect(positions.c).toEqual({ x: 16, y: 224 });
    expect(positions.d).toEqual({ x: 16, y: 328 });
    expect(positions.e).toEqual({ x: 112, y: 16 });
  });
});
