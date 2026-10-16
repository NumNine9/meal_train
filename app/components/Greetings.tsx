// components/Greeting.tsx
'use client';

export function Greeting() {
  const hour = 15; // new Date().getHours(); // TODO: get from server
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return <span className="text-sm text-gray-600">{greeting}</span>;
}