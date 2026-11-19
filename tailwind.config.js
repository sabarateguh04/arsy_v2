module.exports = {
  content: ["./index.html", "./src/client/**/*.{js,html}"],
  theme: {
    extend: {
      colors: {
        "brand-blue": "#1e3a8a",
        "brand-orange": "#f97316"
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"]
      },
      boxShadow: {
        glass: "0 10px 40px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};
