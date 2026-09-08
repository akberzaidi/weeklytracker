/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F7F8F6',
        surface: '#FFFFFF',
        border: '#E4E7E2',
        ink: '#1F2A24',
        muted: '#6B7670',
        sage: {
          DEFAULT: '#3FA47A',
          tint: '#E6F4EE',
        },
        coral: {
          DEFAULT: '#E5735A',
          tint: '#FBEBE6',
        },
        sky: {
          DEFAULT: '#4A90C8',
          tint: '#E8F1FA',
        },
        amber: {
          DEFAULT: '#D9A441',
          tint: '#FBF3E2',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(31, 42, 36, 0.04)',
        'card-hover': '0 4px 12px rgba(31, 42, 36, 0.08)',
      },
    },
  },
  plugins: [],
}
