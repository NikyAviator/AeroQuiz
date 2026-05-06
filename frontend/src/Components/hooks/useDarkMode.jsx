import { useEffect, useState } from 'react';

export default function UseDarkMode() {
  // 1. initial state
  const [enabled, setEnabled] = useState(() => {
    return (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  // 2. side effect: keep DOM + storage in sync
  useEffect(() => {
    const root = document.documentElement;
    if (enabled) {
      root.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      root.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [enabled]);

  return [enabled, setEnabled];
}
