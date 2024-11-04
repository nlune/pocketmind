const { default: daisyui } = require('daisyui');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["cmyk", "nord", "cupcake", "light", "dark", "dim"],
  }
};
