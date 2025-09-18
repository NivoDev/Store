import { createGlobalStyle } from 'styled-components';
import { theme } from '../theme';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${theme.typography.fonts.body};
    font-weight: ${theme.typography.weights.normal};
    line-height: 1.6;
    color: ${theme.colors.dark[100]};
    background: ${theme.colors.gradients.primary};
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
    position: relative;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.dark[900]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.gradients.button};
    border-radius: ${theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.gradients.hover};
  }

  /* Selection styles */
  ::selection {
    background: ${theme.colors.primary[500]};
    color: white;
  }

  ::-moz-selection {
    background: ${theme.colors.primary[500]};
    color: white;
  }

  /* Focus styles */
  :focus {
    outline: 2px solid ${theme.colors.primary[500]};
    outline-offset: 2px;
  }

  :focus:not(:focus-visible) {
    outline: none;
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.typography.fonts.heading};
    font-weight: ${theme.typography.weights.bold};
    line-height: 1.2;
    color: ${theme.colors.dark[50]};
  }

  h1 {
    font-size: ${theme.typography.sizes['5xl']};
    font-weight: ${theme.typography.weights.extrabold};
  }

  h2 {
    font-size: ${theme.typography.sizes['4xl']};
    font-weight: ${theme.typography.weights.bold};
  }

  h3 {
    font-size: ${theme.typography.sizes['3xl']};
    font-weight: ${theme.typography.weights.semibold};
  }

  h4 {
    font-size: ${theme.typography.sizes['2xl']};
    font-weight: ${theme.typography.weights.semibold};
  }

  h5 {
    font-size: ${theme.typography.sizes.xl};
    font-weight: ${theme.typography.weights.medium};
  }

  h6 {
    font-size: ${theme.typography.sizes.lg};
    font-weight: ${theme.typography.weights.medium};
  }

  /* Links */
  a {
    color: ${theme.colors.primary[400]};
    text-decoration: none;
    transition: color ${theme.animation.durations.fast} ${theme.animation.easings.easeInOut};
  }

  a:hover {
    color: ${theme.colors.primary[300]};
  }

  /* Buttons */
  button {
    font-family: inherit;
    cursor: pointer;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Form elements */
  input, textarea, select {
    font-family: inherit;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Responsive breakpoints */
  @media (max-width: ${theme.breakpoints.sm}) {
    html {
      font-size: 14px;
    }
    
    h1 {
      font-size: ${theme.typography.sizes['4xl']};
    }
    
    h2 {
      font-size: ${theme.typography.sizes['3xl']};
    }
    
    h3 {
      font-size: ${theme.typography.sizes['2xl']};
    }
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes neonGlow {
    0%, 100% {
      filter: drop-shadow(0 0 5px ${theme.colors.primary[500]});
    }
    50% {
      filter: drop-shadow(0 0 20px ${theme.colors.primary[400]}) 
              drop-shadow(0 0 30px ${theme.colors.neon.purple});
    }
  }

  /* Utility classes */
  .fade-in {
    animation: fadeIn ${theme.animation.durations.normal} ${theme.animation.easings.easeOut};
  }

  .slide-in {
    animation: slideIn ${theme.animation.durations.normal} ${theme.animation.easings.easeOut};
  }

  .pulse {
    animation: pulse 2s ${theme.animation.easings.easeInOut} infinite;
  }

  .neon-glow {
    animation: neonGlow 3s ${theme.animation.easings.easeInOut} infinite;
  }

  /* Glass morphism effect */
  .glass {
    background: rgba(15, 23, 42, 0.25);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* Neon border effect */
  .neon-border {
    position: relative;
    border: 1px solid transparent;
    background: linear-gradient(${theme.colors.dark[900]}, ${theme.colors.dark[900]}) padding-box,
                ${theme.colors.gradients.neon} border-box;
  }

  /* Text gradient */
  .text-gradient {
    background: ${theme.colors.gradients.neon};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

export default GlobalStyles;
