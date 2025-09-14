import { notFound } from 'next/navigation';

export default function NotFoundRedirectPage() {
  // This page exists only to handle global not-found redirects
  // Immediately call notFound() to trigger the locale-specific not-found.tsx
  notFound();
}