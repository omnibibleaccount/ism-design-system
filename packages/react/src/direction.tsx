import { createContext, useContext, type ReactNode } from 'react';

export type Direction = 'ltr' | 'rtl';

const DirectionContext = createContext<Direction>('ltr');

/**
 * Tell ISM components which way the page reads. The CSS mirrors itself from the `dir` attribute,
 * so this only matters for components that change behaviour (arrow keys in Tabs and sliders, swipe direction).
 * Also set `dir` and `lang` on <html>. Load `@ism/ui/css/rtl` after `@ism/ui/css` for RTL pages.
 */
export function DirectionProvider({ dir, children }: { dir: Direction; children: ReactNode }) {
  return <DirectionContext.Provider value={dir}>{children}</DirectionContext.Provider>;
}

/** Current reading direction (default 'ltr'). */
export function useDirection(): Direction {
  return useContext(DirectionContext);
}
