import { useState, useCallback } from 'react';

export function useTheme() {
  const [dark] = useState(false);
  const [loaded] = useState(true);

  const toggle = useCallback(() => {}, []);

  return { dark, toggle, loaded };
}
