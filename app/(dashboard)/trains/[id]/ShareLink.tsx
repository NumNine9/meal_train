'use client';

import { useState } from 'react';

export function ShareLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: user can select the text manually
    }
  }

  const whatsappMessage = encodeURIComponent(
    `Hi! I've set up a meal train. If you'd like to bring a meal, pick a slot here: ${url}`
  );

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-2">
        Share this link with volunteers
      </h2>
      <p className="text-xs text-blue-800 mb-4">
        Anyone with this link can claim a meal slot. No login required.
      </p>

      <div className="flex gap-2 mb-3">
        <input
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded-lg text-sm text-gray-900 font-mono"
        />
        <button
          type="button"
          onClick={copy}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <a
        href={`https://wa.me/?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 font-medium"
      >
        <span>💬</span>
        <span>Share via WhatsApp</span>
      </a>
    </div>
  );
}