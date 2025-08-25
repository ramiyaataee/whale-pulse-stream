import { useEffect, useCallback } from 'react';
import { toast } from './use-toast';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const shortcut = shortcuts.find(s => 
      s.key.toLowerCase() === event.key.toLowerCase() &&
      (s.ctrlKey || false) === event.ctrlKey &&
      (s.altKey || false) === event.altKey &&
      (s.shiftKey || false) === event.shiftKey
    );

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return shortcuts;
};

// Predefined shortcuts for the trading platform
export const useTradingShortcuts = (callbacks: {
  openChart?: () => void;
  openPortfolio?: () => void;
  openAlerts?: () => void;
  openSettings?: () => void;
  toggleFullscreen?: () => void;
  refresh?: () => void;
  showHelp?: () => void;
}) => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: '1',
      ctrlKey: true,
      action: callbacks.openChart || (() => {}),
      description: 'باز کردن نمودار'
    },
    {
      key: '2',
      ctrlKey: true,
      action: callbacks.openPortfolio || (() => {}),
      description: 'باز کردن پورتفولیو'
    },
    {
      key: '3',
      ctrlKey: true,
      action: callbacks.openAlerts || (() => {}),
      description: 'باز کردن هشدارها'
    },
    {
      key: '4',
      ctrlKey: true,
      action: callbacks.openSettings || (() => {}),
      description: 'باز کردن تنظیمات'
    },
    {
      key: 'F11',
      action: callbacks.toggleFullscreen || (() => {}),
      description: 'تمام صفحه'
    },
    {
      key: 'F5',
      action: callbacks.refresh || (() => {}),
      description: 'به‌روزرسانی'
    },
    {
      key: 'h',
      ctrlKey: true,
      action: callbacks.showHelp || (() => {
        toast({
          title: "کلیدهای میانبر",
          description: "Ctrl+H: راهنما، Ctrl+1-4: تبدیل بین صفحات، F5: به‌روزرسانی، F11: تمام صفحه",
        });
      }),
      description: 'نمایش راهنما'
    },
    {
      key: 'r',
      ctrlKey: true,
      shiftKey: true,
      action: () => window.location.reload(),
      description: 'بارگذاری مجدد صفحه'
    }
  ];

  return useKeyboardShortcuts(shortcuts);
};