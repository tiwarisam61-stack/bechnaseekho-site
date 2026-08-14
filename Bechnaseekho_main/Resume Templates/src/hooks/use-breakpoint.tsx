import * as React from "react";

/** Returns true when the viewport is narrower than `width` (px). SSR-safe. */
export function useMaxWidth(width: number) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${width - 1}px)`);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [width]);

  return matches;
}

/** Phone + small tablet portrait: below the `lg` (1024px) breakpoint. */
export const useIsCompact = () => useMaxWidth(1024);
