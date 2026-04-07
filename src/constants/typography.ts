export const TYPOGRAPHY = {
  fontFamily: "Montserrat", // Requires expo-font or similar if using Google Fonts
  appBar: {
    color: "rgba(100, 100, 100, 1)",
    fontSize: 20,
    fontWeight: "400" as const,
  },
  montserrat: {
    medium: {
      fontFamily: "Montserrat-Medium",
      fontWeight: "500" as const,
    },
    regular: {
      fontFamily: "Montserrat-Regular",
      fontWeight: "400" as const,
    },
    semiBold: {
      fontFamily: "Montserrat-SemiBold",
      fontWeight: "600" as const,
    },
    bold: {
      fontFamily: "Montserrat-Bold",
      fontWeight: "700" as const,
    },
  }
};
