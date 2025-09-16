import { Suspense } from 'react';
import { Metadata } from 'next';
import HomePage from '@/components/pages/HomePage';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export const metadata: Metadata = {
  title: 'Atomic Rose Tools - Premium Psytrance Sample Packs & MIDI',
  description: 'Discover premium psytrance sample packs, MIDI files, and acapellas from Atomic Rose Tools. Professional quality sounds for producers and DJs.',
  keywords: 'psytrance, sample packs, MIDI, acapellas, electronic music, production, DJ',
  openGraph: {
    title: 'Atomic Rose Tools - Premium Psytrance Sample Packs & MIDI',
    description: 'Discover premium psytrance sample packs, MIDI files, and acapellas from Atomic Rose Tools.',
    images: ['/images/og-image.jpg'],
  },
};

// This function runs on the server
async function getProducts() {
  try {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://store-6ryk.onrender.com/api/v1';
    const response = await fetch(`${API_BASE_URL}/products?limit=8&featured=true`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products for SSR:', error);
    return { products: [], total: 0 };
  }
}

export default async function Home() {
  // Fetch products on the server
  const productsData = await getProducts();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomePage initialProducts={productsData.products || []} />
    </Suspense>
  );
}