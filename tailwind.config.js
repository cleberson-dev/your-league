const path = require("path");
const fromRoot = (p) => path.join(__dirname, p);

/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: "jit",
	content: [fromRoot("./app/**/*.+(js|ts|tsx|mdx|md)")],
	darkMode: "media",
	theme: {
		extend: {
			colors: {
				background: "#EDEDE9",
				gray: "#D9D9D9",
				violet: "#8338EC",
				primary: {
					DEFAULT: "#F5EBE0",
					dark: "#E3D5CA",
				},
				green: "#8AC926",
				red: "#DF2935",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require("@tailwindcss/forms")],
};
