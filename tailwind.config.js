import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-primary": "#ffffff",
        "tertiary-container": "#5b49b5",
        "secondary-container": "#8af5be",
        "background": "#f8f9fb",
        "surface-tint": "#0c56d0",
        "outline-variant": "#c3c6d6",
        "primary-fixed": "#dae2ff",
        "on-secondary-container": "#00714b",
        "surface-variant": "#e1e2e4",
        "tertiary": "#432f9c",
        "secondary": "#006c47",
        "on-background": "#191c1e",
        "on-tertiary-fixed-variant": "#4633a0",
        "primary-fixed-dim": "#b2c5ff",
        "surface-container-lowest": "#ffffff",
        "inverse-surface": "#2e3132",
        "on-surface-variant": "#434654",
        "error": "#ba1a1a",
        "on-secondary-fixed": "#002113",
        "tertiary-fixed-dim": "#c9bfff",
        "primary": "#003d9b",
        "on-error": "#ffffff",
        "inverse-primary": "#b2c5ff",
        "surface-container-low": "#f3f4f6",
        "on-primary-fixed": "#001848",
        "surface-container-highest": "#e1e2e4",
        "surface": "#f8f9fb",
        "primary-container": "#0052cc",
        "on-secondary": "#ffffff",
        "surface-container-high": "#e7e8ea",
        "on-tertiary-fixed": "#1a0063",
        "tertiary-fixed": "#e5deff",
        "error-container": "#ffdad6",
        "outline": "#737685",
        "secondary-fixed": "#8df7c1",
        "inverse-on-surface": "#f0f1f3",
        "on-tertiary": "#ffffff",
        "on-surface": "#191c1e",
        "on-primary-container": "#c4d2ff",
        "surface-container": "#edeef0",
        "on-error-container": "#93000a",
        "surface-dim": "#d9dadc",
        "surface-bright": "#f8f9fb",
        "on-secondary-fixed-variant": "#005235",
        "secondary-fixed-dim": "#71dba6",
        "on-tertiary-container": "#d5ccff",
        "on-primary-fixed-variant": "#0040a2"
      },
      fontFamily: {
        "headline": ["Manrope", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [
    forms,
    containerQueries
  ],
}