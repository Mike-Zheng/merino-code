import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

const customDarkTheme = {
  dark: true,
  colors: {
    background: "#15202b",
    surface: "#15202b",
    primary: "#3f51b5",
    secondary: "#03dac6",
    error: "#f44336",
    info: "#2196F3",
    success: "#4caf50",
    warning: "#fb8c00"
  }
};

const customLightTheme = {
  dark: false,
  colors: {
    background: "#808080",
    surface: "#6200EE",
    primary: "#6200EE",
    "primary-darken-1": "#3700B3",
    secondary: "#03DAC6",
    "secondary-darken-1": "#018786",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00"
  }
};

const customTheme = {
  dark: false,
  colors: {
    background: "#34A853",
    surface: "#FF0101",
    primary: "#FF0101",
    "primary-darken-1": "#FF0101",
    secondary: "#03DAC6",
    "secondary-darken-1": "#018786",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FF0101"
  }
};

export default createVuetify(
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  {
    theme: {
      defaultTheme: "light",
      themes: {
        customDarkTheme,
        customLightTheme,
        customTheme
      }
    }
  }
);
