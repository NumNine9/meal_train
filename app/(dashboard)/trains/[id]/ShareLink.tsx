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
      // Fallback: prompt the user to copy manually
      window.prompt('Copy this link:', url);
    }
  }

  const whatsappMessage = encodeURIComponent(
    `Hi! I've set up a meal train. If you'd like to bring a meal, pick a slot here: ${url}`
  );

  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-2">
        Invite volunteers
      </h2>
      <p className="text-xs text-blue-800 mb-4">
        Share this link with anyone who would like to help. No login required
        — they just pick a slot.
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={copy}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-blue-300 text-blue-800 text-sm font-medium rounded-lg hover:bg-blue-100 transition"
        >
          <span>{copied ? '✓' : '🔗'}</span>
          <span>{copied ? 'Link copied!' : 'Copy invite link'}</span>
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
        >
          <span>💬</span>
          <span>Share via WhatsApp</span>
        </a>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-700 hover:text-blue-900 underline"
        >
          Preview what volunteers see →
        </a>
        <span className="text-xs text-blue-700/60">
          Private link · only people you share it with
        </span>
      </div>
    </div>
  );
}