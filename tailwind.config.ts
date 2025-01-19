import { type Config } from 'tailwindcss';

export default {
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: 'currentColor',
      },
    },
  },
} satisfies Config;
