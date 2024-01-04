const path = require("path");
const fromRoot = p => path.join(__dirname, p);

module.exports = {
	mode: "jit",
	content: [fromRoot("./app/**/*.+(js|ts|tsx|mdx|md)")],
	darkMode: "media",
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#F5EBE0",
					dark: "#E3D5CA",
				},
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [
		require("@tailwindcss/forms"),
	],
};
