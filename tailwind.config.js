/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "icon-color": "var(--icon_color)",
        "blue-color": "var(--blue_color)",
        "active-green-color": "var(--active_green_color)",
        "red-color": "var(--red_color)",
        main: "var(--bg)",
        second: "var(--bg_2)",
        third: "var(--bg_3)",
        msg: "var(--bg_msg)",
        "primary-text": "var(--primary_text)",
        "secondary-text": "var(--secondary_text)",
      },
      fontFamily: {
        fredoka: ["Fredoka", "sans-serif"],
      },
    },
  },
  plugins: [],
};
