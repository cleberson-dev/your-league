const path = require("path");
const fromRoot = (p) => path.join(__dirname, p);

/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: "jit",
	content: [fromRoot("./app/**/*.+(js|ts|tsx|mdx|md)")],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				gray: "#D9D9D9",
				violet: "#8338EC",
				primary: {
					DEFAULT: "#F5EBE0",
					dark: "#E3D5CA",
				},
				green: "#8AC926",
				red: "#DF2935",
				dark: "#2B2D42",
				darker: "#001219",
				light: "#EDEDE9",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require("@tailwindcss/forms")],
};
