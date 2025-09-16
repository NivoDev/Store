import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '../lib/registry';
import GlobalStyles from '../components/GlobalStyles';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Atomic Rose Tools - Premium Psytrance Sample Packs & MIDI',
  description: 'Discover premium psytrance sample packs, MIDI files, and acapellas from Atomic Rose Tools. Professional quality sounds for producers and DJs.',
  keywords: 'psytrance, sample packs, MIDI, acapellas, electronic music, production, DJ',
  authors: [{ name: 'Atomic Rose Tools' }],
  creator: 'Atomic Rose Tools',
  publisher: 'Atomic Rose Tools',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://atomic-rose-tools.netlify.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Atomic Rose Tools - Premium Psytrance Sample Packs & MIDI',
    description: 'Discover premium psytrance sample packs, MIDI files, and acapellas from Atomic Rose Tools.',
    url: 'https://atomic-rose-tools.netlify.app',
    siteName: 'Atomic Rose Tools',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Atomic Rose Tools - Premium Psytrance Sample Packs',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atomic Rose Tools - Premium Psytrance Sample Packs & MIDI',
    description: 'Discover premium psytrance sample packs, MIDI files, and acapellas from Atomic Rose Tools.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <GlobalStyles />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}