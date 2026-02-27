export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F5F6FA",
        card: "#FFFFFF",
        primaryStart: "#7B61FF",
        primaryEnd: "#5A4FCF",
        primaryBorder: "#6C5DD3",
        mutedText: "#8E8EA9",
        darkText: "#111827",
        pollBg: "#F2F3F8",
        pollTrack: "#E7E8F2",
        pollHeader: "#3F3F46"
      },
      borderRadius: {
        card: "16px",
        pill: "9999px"
      },
      boxShadow: {
        card: "0px 12px 30px rgba(0,0,0,0.05)",
        modal: "0px 20px 60px rgba(0,0,0,0.15)"
      }
    }
  }
}