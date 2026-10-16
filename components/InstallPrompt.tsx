'use client';

import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_KEY = 'mealtrain-install-dismissed';

export function InstallPrompt() {
  // Lazy initializer: reads localStorage once during mount.
  // Safe for SSR because we check `typeof window`.
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return !!localStorage.getItem(DISMISS_KEY);
  });

  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  }

  async function install() {
    if (!event) return;
    await event.prompt();
    const { outcome } = await event.userChoice;
    if (outcome === 'accepted') dismiss();
    setEvent(null);
  }

  if (dismissed || !event) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-gray-900 text-white rounded-xl shadow-lg p-4 flex items-center gap-3 z-50">
      <span className="text-2xl">🍲</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">Install Meal Train SA</p>
        <p className="text-xs text-gray-300 mt-0.5">
          Add to home screen for quick access.
        </p>
      </div>
      <button
        onClick={dismiss}
        className="text-xs text-gray-400 hover:text-white px-2"
        aria-label="Dismiss"
      >
        ✕
      </button>
      <button
        onClick={install}
        className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap"
      >
        Install
      </button>
    </div>
  );
}