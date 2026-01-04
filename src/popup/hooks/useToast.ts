import { useState, useCallback } from 'react';
import { ToastData } from '../components/Toast';

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showSuccess = useCallback((message: string) => {
    return addToast({ message, type: 'success' });
  }, [addToast]);

  const showError = useCallback((message: string) => {
    return addToast({ message, type: 'error' });
  }, [addToast]);

  const showInfo = useCallback((message: string) => {
    return addToast({ message, type: 'info' });
  }, [addToast]);

  const showUndo = useCallback((message: string, onUndo: () => void) => {
    return addToast({ message, type: 'undo', duration: 5000, onUndo });
  }, [addToast]);

  return {
    toasts,
    addToast,
    dismissToast,
    showSuccess,
    showError,
    showInfo,
    showUndo,
  };
}



