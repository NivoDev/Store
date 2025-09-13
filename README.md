# Atomic Rose Tools Store

A modern, responsive ecommerce website for selling sample packs, MIDI packs, and acapellas with a progressive psytrance aesthetic.

## 🎵 Features

- **Modern Progressive Psytrance Design**: Futuristic UI with neon accents and glass morphism effects
- **Product Categories**: Sample packs, MIDI packs, and acapellas
- **User Authentication**: Sign in/sign up with modern modal interface
- **Shopping Cart**: Full cart functionality with persistent storage
- **Payment Integration**: PayMe.io integration ready for production
- **Responsive Design**: Optimized for all devices
- **Audio Previews**: Built-in audio player for product previews
- **Search & Filters**: Advanced product filtering and search
- **Wishlist**: Save favorite products
- **User Profiles**: Account management and purchase history

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router DOM 6
- **Styling**: Styled Components with custom design system
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Forms**: React Hook Form
- **Icons**: React Icons (Feather)
- **Payment**: PayMe.io (integration ready)
- **Hosting**: Netlify ready

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 7.0.0 or higher

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Store
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── common/         # Reusable UI components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── payment/        # Payment integration components
│   └── product/        # Product-related components
├── contexts/           # React Context providers
├── data/              # Mock data and API helpers
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── styles/            # Global styles and theme
├── theme/             # Design system and theme
└── App.js             # Main application component
```

## 🎨 Design System

The design system is built around progressive psytrance aesthetics:

- **Colors**: Dark theme with neon accents (cyan, purple, pink)
- **Typography**: Orbitron for headings, Inter for body text
- **Effects**: Glass morphism, neon glows, gradient overlays
- **Animation**: Smooth transitions and micro-interactions

## 💳 PayMe.io Integration

The store is prepared for PayMe.io integration:

1. **Environment Variables**: Set up your PayMe.io credentials
```bash
REACT_APP_PAYME_API_KEY=your_api_key
REACT_APP_PAYME_WEBHOOK_URL=your_webhook_url
```

2. **Payment Flow**: 
   - Create payment session
   - Process payment with selected method
   - Handle webhooks for payment confirmation
   - Manage refunds and disputes

3. **Supported Payment Methods**:
   - Credit/Debit Cards
   - PayPal
   - Apple Pay
   - Google Pay
   - Bank Transfers

## 🛒 Features Overview

### Authentication System
- Modal-based sign in/sign up
- Form validation with React Hook Form
- Persistent user sessions
- Password visibility toggle
- Social login ready (Google)

### Shopping Cart
- Add/remove items
- Quantity management
- Discount codes support
- Tax calculation
- Shipping options
- Persistent cart storage

### Product Management
- Dynamic product listings
- Advanced filtering (genre, BPM, price)
- Search functionality
- Product previews with audio player
- Wishlist functionality
- Product recommendations

### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interactions
- Progressive enhancement

## 🔧 Customization

### Adding New Products
Update `src/data/mockProducts.js` with new product data:

```javascript
{
  id: 'unique_id',
  type: 'sample-pack', // 'midi-pack', 'acapella'
  title: 'Product Name',
  artist: 'Artist Name',
  price: 24.99,
  // ... other properties
}
```

### Modifying Theme
Edit `src/theme/index.js` to customize colors, typography, and spacing:

```javascript
export const theme = {
  colors: {
    primary: { /* your colors */ },
    neon: { /* neon accent colors */ },
    // ...
  },
  // ...
};
```

### Adding Payment Methods
Extend the PayMe.io integration in `src/hooks/usePayMe.js` and `src/components/payment/PaymentButton.js`.

## 🚀 Deployment

### Netlify Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variables for PayMe.io

### Environment Variables
```
REACT_APP_PAYME_API_KEY=your_payme_api_key
REACT_APP_PAYME_WEBHOOK_URL=https://your-domain.com/api/payme/webhook
NODE_ENV=production
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or support, please contact [your-email@domain.com]

---

Built with ❤️ for the psytrance community
