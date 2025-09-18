# Atomic Rose Tools Store - Frontend

React-based frontend application for the Atomic Rose Tools e-commerce store.

## Features

- **Modern React App**: Built with React 18 and modern hooks
- **Responsive Design**: Mobile-first, dark theme with neon accents
- **State Management**: React Context for auth and cart
- **Routing**: React Router for navigation
- **Styling**: Styled-components with theme system
- **Animations**: Framer Motion for smooth transitions
- **API Integration**: Custom API service for backend communication

## Tech Stack

- **React 18** - UI framework
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **React Hook Form** - Form handling

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── auth/         # Authentication components
│   ├── cart/         # Shopping cart components
│   ├── common/       # Shared components
│   ├── layout/       # Layout components (Header, Footer)
│   ├── modals/       # Modal components
│   └── product/      # Product-related components
├── contexts/         # React Context providers
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── services/        # API and external services
├── styles/          # Global styles
├── theme/           # Theme configuration
└── utils/           # Utility functions
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Key Components

### Authentication
- `AuthModal` - Login/signup modal
- `AuthContext` - Authentication state management

### Shopping Cart
- `CartContext` - Cart state management
- `CartPage` - Cart and checkout page
- `ProductCard` - Product display component

### User Interface
- `Header` - Navigation header
- `Footer` - Site footer
- `Modal` - Reusable modal component

## API Integration

The frontend communicates with the backend through the `APIService` class:

```javascript
import apiService from '../services/api';

// Example usage
const products = await apiService.getProducts();
const user = await apiService.getCurrentUser();
```

## Styling

Uses a centralized theme system with styled-components:

```javascript
import { theme } from '../theme';

const StyledComponent = styled.div`
  color: ${theme.colors.primary[500]};
  padding: ${theme.spacing[4]};
`;
```

## Deployment

The frontend is configured for deployment on Netlify with the `netlify.toml` configuration file.
