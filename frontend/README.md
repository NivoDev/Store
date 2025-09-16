# Atomic Rose Tools - SSR Frontend

This is the Server-Side Rendered (SSR) version of the Atomic Rose Tools frontend, built with Next.js 15.

## Features

- ✅ **Server-Side Rendering (SSR)** - Pages are rendered on the server for better SEO and performance
- ✅ **Static Site Generation (SSG)** - Pre-rendered pages for optimal loading speeds
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **Styled Components** - CSS-in-JS with SSR support
- ✅ **SEO Optimized** - Meta tags, Open Graph, and structured data
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **API Integration** - Connected to the FastAPI backend

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file:

```env
REACT_APP_API_BASE_URL=https://store-6ryk.onrender.com/api/v1
NEXT_PUBLIC_API_BASE_URL=https://store-6ryk.onrender.com/api/v1
```

## Deployment

### Netlify

1. Connect your GitHub repository to Netlify
2. Set the build directory to `frontend-ssr`
3. Set the build command to `npm run build`
4. Set the publish directory to `.next`
5. Add environment variables in Netlify dashboard

### Vercel

1. Import your GitHub repository to Vercel
2. Set the root directory to `frontend-ssr`
3. Vercel will automatically detect Next.js and configure the build

## SSR Benefits

1. **SEO Optimization** - Search engines can crawl and index the content
2. **Faster Initial Load** - HTML is pre-rendered on the server
3. **Better Performance** - Reduced client-side JavaScript execution
4. **Social Media Sharing** - Open Graph meta tags work properly
5. **Accessibility** - Screen readers can access content immediately

## Project Structure

```
frontend-ssr/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── common/        # Shared components
│   │   ├── layout/        # Layout components
│   │   ├── pages/         # Page components
│   │   └── product/       # Product-related components
│   ├── lib/               # Utility libraries
│   ├── services/          # API services
│   └── theme/             # Theme configuration
├── public/                # Static assets
├── next.config.js         # Next.js configuration
└── netlify.toml          # Netlify deployment config
```

## API Integration

The SSR app connects to the FastAPI backend running on Render:

- **Base URL**: `https://store-6ryk.onrender.com/api/v1`
- **Health Check**: `/health`
- **Products**: `/products`
- **Authentication**: `/auth/*`
- **Guest Checkout**: `/guest/*`

## Performance

- **First Load JS**: ~128 kB
- **Page Size**: ~8.73 kB (home page)
- **Revalidation**: 5 minutes for dynamic content
- **Static Generation**: Pre-rendered pages for optimal performance

## Migration from CSR

This SSR version maintains compatibility with the existing CSR React app while providing:

- Better SEO and performance
- Server-side data fetching
- Improved user experience
- Better search engine visibility

## Contributing

1. Make changes to the components
2. Test with `npm run dev`
3. Build with `npm run build`
4. Deploy to staging/production

## License

© 2024 Atomic Rose Tools. All rights reserved.