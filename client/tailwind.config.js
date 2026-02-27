export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6C5DD3",
        primaryLight: "#7C6CF5",
        background: "#F8F9FD",
        borderLight: "#E6E8F0",
        textMuted: "#6B7280"
      },
      borderRadius: {
        xl2: "20px"
      },
      boxShadow: {
        card: "0px 10px 30px rgba(0,0,0,0.04)"
      }
    }
  }
}