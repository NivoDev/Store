'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #f8fafc;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    min-height: 100vh;
    overflow-x: hidden;
  }

  #__next {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1e293b;
  }

  ::-webkit-scrollbar-thumb {
    background: #475569;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }

  /* Selection */
  ::selection {
    background: rgba(59, 130, 246, 0.3);
    color: #f8fafc;
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Remove focus outline for mouse users */
  *:focus:not(:focus-visible) {
    outline: none;
  }

  /* Smooth transitions */
  * {
    transition: color 150ms ease-in-out, background-color 150ms ease-in-out, border-color 150ms ease-in-out;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    color: #f8fafc;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.5rem;
  }

  h4 {
    font-size: 1.25rem;
  }

  h5 {
    font-size: 1.125rem;
  }

  h6 {
    font-size: 1rem;
  }

  p {
    margin-bottom: 1rem;
    color: #cbd5e1;
  }

  a {
    color: #60a5fa;
    text-decoration: none;
    transition: color 150ms ease-in-out;
  }

  a:hover {
    color: #93c5fd;
  }

  /* Button reset */
  button {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  }

  /* Input reset */
  input, textarea, select {
    font: inherit;
    color: inherit;
  }

  /* Image optimization */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* Loading states */
  .loading {
    opacity: 0.6;
    pointer-events: none;
  }

  /* Error states */
  .error {
    color: #ef4444;
  }

  /* Success states */
  .success {
    color: #10b981;
  }

  /* Warning states */
  .warning {
    color: #f59e0b;
  }
`;

export default GlobalStyles;
