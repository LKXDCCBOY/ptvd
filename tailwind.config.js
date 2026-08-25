/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00FF88',
        'neon-blue': '#00D4FF',
        'dark-900': '#0A0E17',
        'dark-800': '#0F1523',
        'dark-700': '#151C2E',
        'dark-600': '#1E2740',
        'dark-500': '#2A3555',
        'dark-400': '#3D4A6C',
        'dark-300': '#5A6B8C',
        'dark-200': '#8892A6',
        'dark-100': '#B8C0CC',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 255, 136, 0.3)',
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(0, 255, 136, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
