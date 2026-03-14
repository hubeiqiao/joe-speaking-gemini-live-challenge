import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import { AppProviders } from '@/components/providers/AppProviders';
import './globals.css';

const bodyFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
});

const displayFont = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Joe Speaking Gemini Live Challenge',
  description:
    'Competition-only Joe Speaking build for the Gemini Live Agent Challenge.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} bg-[var(--background)] text-[var(--foreground)]`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

