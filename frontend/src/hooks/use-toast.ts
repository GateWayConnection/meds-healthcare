
import { useState } from 'react';

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

interface Toast extends ToastProps {
  id: string;
}

let toastCounter = 0;

const toastState = {
  toasts: [] as Toast[],
  listeners: [] as ((toasts: Toast[]) => void)[]
};

const addToast = (toast: ToastProps) => {
  const id = (++toastCounter).toString();
  const newToast: Toast = { ...toast, id };
  
  toastState.toasts.push(newToast);
  toastState.listeners.forEach(listener => listener([...toastState.toasts]));
  
  // Auto remove after duration
  setTimeout(() => {
    toastState.toasts = toastState.toasts.filter(t => t.id !== id);
    toastState.listeners.forEach(listener => listener([...toastState.toasts]));
  }, toast.duration || 5000);
  
  return id;
};

export const toast = (props: ToastProps) => {
  return addToast(props);
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>(toastState.toasts);
  
  useState(() => {
    const listener = (newToasts: Toast[]) => setToasts(newToasts);
    toastState.listeners.push(listener);
    
    return () => {
      toastState.listeners = toastState.listeners.filter(l => l !== listener);
    };
  });
  
  return { toast, toasts };
};
