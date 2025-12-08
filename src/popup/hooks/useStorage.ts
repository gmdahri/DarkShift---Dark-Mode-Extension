import { useState, useEffect } from 'react';
import { getDarkModeState, setDarkModeState } from '../../utils/storage';

export function useStorage(domain: string) {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getDarkModeState(domain).then(state => {
      setEnabled(state);
      setLoading(false);
    });
  }, [domain]);

  const updateEnabled = async (value: boolean) => {
    await setDarkModeState(domain, value);
    setEnabled(value);
  };

  return { enabled, loading, updateEnabled };
}

