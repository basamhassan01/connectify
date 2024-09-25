import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#007aff",
        		secondary: "#0056b3",
        		accent: "#9ba7a7",
        		neutral: "#f1f8ff",
        		subNeutral: "#757575",
        		text: "#333333",
        		background: "#ffffff",
			},
		},
	},
	
	plugins: [daisyui],

	daisyui: {
		themes: [
			"light",
			{
				light: {
					...daisyUIThemes["light"],
					primary: "#007aff",
					secondary: "#0056b3",
					accent: "#9ba7a7",
					neutral: "#f1f8ff",
					subNeutral: "#757575",
					text: "#333333",
					background: "#ffffff",
				},
			},
		],
	},
};