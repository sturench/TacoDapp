module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'taco_1': '#FFFCF8',
        'taco_2': '#D2AF95',
        'dark_choco': '#26160A',
        'choco': '#4C2C15',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'quador': ['Quador', 'serif']
      },
    },
  },
  plugins: [],
};
