import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		'node_modules/daisyui/dist/**/*.js',
		'node_modules/react-daisyui/dist/**/*.js',
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
	daisyui: {
		themes: [
			{
				mytheme: {
					"primary": "#242424",
					"secondary": "#f6d860",
					"accent": "#37cdbe",
					"neutral": "#3d4451",
					"base-100": "#ffffff",
				},
			},
		],
	},
};
export default config;
