import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand palette — matches the prototype
        teal: {
          50:  '#e1f5ee',
          100: '#9fe1cb',
          500: '#1d9e75',
          600: '#0f6e56',
          700: '#085041',
        },
        shame: {
          50:  '#fff8f8',
          100: '#fca5a5',
          500: '#e24b4a',
          700: '#7f1d1d',
          900: '#501313',
        },
        xp: {
          50:  '#eeedfe',
          100: '#afa9ec',
          500: '#7f77dd',
          700: '#3c3489',
        },
      },
    },
  },
  plugins: [],
}

export default config
