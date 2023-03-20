/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-red": "#E51013",
        "primary-black": {
          900: "#141414",
          600: "#181818",
          300: "#2F2F2F",
        },
        "primary-white": {
          300: "#fff",
          600: "#e5e5e5",
        },
      },
    },
  },
  plugins: [],
};
