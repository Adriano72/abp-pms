import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  // @ts-ignore - DaisyUI adds its own custom config
  daisyui: {
    themes: ['dark'],
  },
}

export default config
