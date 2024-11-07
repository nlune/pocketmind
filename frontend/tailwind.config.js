const { default: daisyui } = require('daisyui');

module.exports = {
  // mode: 'jit',
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  plugins: [require('daisyui')],
  theme: {
    extend: {
      colors: {
        custom1: '#34495e',
        custom2: '#aacfd0',
        custom3: '#46627f',
        custom4: '#222f3d',
        custom5: '#cbe2e2',
        custom6: '#ffffff',
      },
    },
  },
  daisyui: {
    themes: ["cmyk", "nord", "cupcake", "light", "dark", "dim"], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
    theme: {
    extend: {
      colors: {
        'red-700': '#b91c1c',
        'orange-500': '#f97316',
        'amber-400': '#fbbf24',
        'lime-400': '#a8e063',
        'green-600': '#16a34a',
        'emerald-500': '#10b981',
        'teal-400': '#2dd4bf',
        'cyan-600': '#0891b2',
        'sky-400': '#38bdf8',
        'blue-700': '#1d4ed8',
        'indigo-600': '#4f46e5',
        'violet-500': '#8b5cf6',
        'purple-400': '#c084fc',
        'fuchsia-400': '#e879f9',
        'pink-300': '#f9a8d4',
        'rose-600': '#e11d48',
      },
    },
  },
};
