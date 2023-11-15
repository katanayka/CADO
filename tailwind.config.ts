import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
	},
	plugins: [
		require("daisyui"),
		require("tailwind-heropatterns")({
			variants: [],
			patterns: ["diagonal-lines", "graph-paper"],
			colors: {
				default: "#238bc8",
			},
			opacity: {
				default: "0.4",
			},
		}),
	],
};
export default config;
