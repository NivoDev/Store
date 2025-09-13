import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
  title = "Guerrilla Music Store",
  description = "Premium sample packs, MIDI packs, and acapellas for progressive psytrance producers. High-quality sounds for professional music production.",
  keywords = "psytrance, sample packs, MIDI packs, acapellas, progressive psytrance, music production, electronic music, Guerrilla Music",
  image = "/images/og-image.jpg",
  url = "https://guerrillamusic.netlify.app",
  type = "website",
  author = "Guerrilla Music",
  locale = "en_US",
  siteName = "Guerrilla Music Store"
}) => {
  const fullTitle = title === "Guerrilla Music Store" ? title : `${title} | Guerrilla Music Store`;
  const canonicalUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@guerrillamusic" />
      <meta name="twitter:creator" content="@guerrillamusic" />

      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#0ea5e9" />
      <meta name="msapplication-TileColor" content="#0ea5e9" />
      <meta name="application-name" content={siteName} />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MusicStore",
          "name": siteName,
          "description": description,
          "url": canonicalUrl,
          "logo": `${canonicalUrl}/images/logo.png`,
          "image": image,
          "sameAs": [
            "https://instagram.com/guerrillamusic",
            "https://twitter.com/guerrillamusic",
            "https://facebook.com/guerrillamusic",
            "https://youtube.com/guerrillamusic"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Support",
            "email": "support@guerrillamusic.com"
          },
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "USD",
            "lowPrice": "12.99",
            "highPrice": "26.99",
            "offerCount": "25"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
