import { useState, useEffect, useCallback } from 'react';
import { SiteListEntry, getWhitelist, getBlacklist, addToWhitelist, removeFromWhitelist, addToBlacklist, removeFromBlacklist, clearWhitelist, clearBlacklist } from '../../utils/siteList';

export function useSiteList() {
  const [whitelist, setWhitelist] = useState<SiteListEntry[]>([]);
  const [blacklist, setBlacklist] = useState<SiteListEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLists = useCallback(async () => {
    setLoading(true);
    try {
      const [white, black] = await Promise.all([
        getWhitelist(),
        getBlacklist(),
      ]);
      setWhitelist(white);
      setBlacklist(black);
    } catch (error) {
      console.error('Failed to load site lists:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const addToWhite = useCallback(async (domain: string, note?: string) => {
    await addToWhitelist(domain, note);
    await loadLists();
  }, [loadLists]);

  const removeFromWhite = useCallback(async (domain: string) => {
    await removeFromWhitelist(domain);
    await loadLists();
  }, [loadLists]);

  const addToBlack = useCallback(async (domain: string, note?: string) => {
    await addToBlacklist(domain, note);
    await loadLists();
  }, [loadLists]);

  const removeFromBlack = useCallback(async (domain: string) => {
    await removeFromBlacklist(domain);
    await loadLists();
  }, [loadLists]);

  const clearWhite = useCallback(async () => {
    await clearWhitelist();
    await loadLists();
  }, [loadLists]);

  const clearBlack = useCallback(async () => {
    await clearBlacklist();
    await loadLists();
  }, [loadLists]);

  return {
    whitelist,
    blacklist,
    loading,
    addToWhite,
    removeFromWhite,
    addToBlack,
    removeFromBlack,
    clearWhite,
    clearBlack,
    refresh: loadLists,
  };
}

