import type { Config } from 'tailwindcss';
import { heroui } from '@heroui/react';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        landing: 'var(--landing-shadow-lg)',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        'surface-soft': 'var(--surface-soft)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        divider: 'var(--divider)',
        default: 'var(--default)',
        'default-foreground': 'var(--default-foreground)',
      },
    },
  },
  darkMode: 'class',
  plugins: [heroui() as never],
};

export default config;
