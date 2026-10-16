'use client';

import { useState, useTransition } from 'react';
import { logReminder } from './reminder-actions';

type Props = {
  slotId: string;
  volunteerPhone: string;
  whatsappUrl: string;
};

export function SendReminderButton({
  slotId,
  volunteerPhone,
  whatsappUrl,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  function handleClick() {
    // 1. Open WhatsApp immediately.
    //    Must be inside the click handler — if we await first,
    //    popup blockers will block the window.
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // 2. Log the reminder on the server.
    startTransition(async () => {
      const fd = new FormData();
      fd.append('slotId', slotId);

      const result = await logReminder({}, fd);

      if (result.success) {
        setSent(true);
        setTimeout(() => setSent(false), 3000);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-xs text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
      title={`Send WhatsApp to ${volunteerPhone}`}
    >
      {sent ? '✓ Sent' : isPending ? 'Sending…' : '💬 Remind'}
    </button>
  );
}