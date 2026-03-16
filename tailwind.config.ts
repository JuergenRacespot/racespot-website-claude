import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rs: {
          yellow:  '#F5C000',
          'yellow-dark': '#D4A800',
          black:   '#0A0A0A',
          dark:    '#111111',
          gray:    '#1A1A1A',
          s3:      '#242424',
          muted:   '#777777',
          border:  '#2A2A2A',
          white:   '#FFFFFF',
          live:    '#E53E3E',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-eurostile)', 'var(--font-oswald)', 'Arial Black', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'display': ['clamp(2.25rem, 5.5vw, 3.75rem)', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '900' }],
        'headline': ['clamp(1.5rem, 4vw, 2.25rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
      borderRadius: {
        rs: '6px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'line-grow': 'lineGrow 0.8s ease forwards',
        'pulse-live': 'pulseLive 2s ease-in-out infinite',
        'ticker': 'ticker 35s linear infinite',
        'scroll-left': 'scrollLeft 50s linear infinite',
        'scroll-right': 'scrollRight 50s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        lineGrow: {
          from: { transform: 'scaleX(0)' },
          to:   { transform: 'scaleX(1)' },
        },
        pulseLive: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.2)' },
        },
        ticker: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        scrollLeft: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        scrollRight: {
          from: { transform: 'translateX(-50%)' },
          to:   { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
