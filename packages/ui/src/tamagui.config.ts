import { createTamagui } from "tamagui";
import { config as defaultConfig } from "@tamagui/config/v3";

const fexoraConfig = createTamagui({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    color: {
      ...defaultConfig.tokens.color,
      fexoraPrimary: "#7C3AED",
      fexoraPrimaryLight: "#A78BFA",
      fexoraPrimaryDark: "#5B21B6",
      fexoraAccent: "#EC4899",
      fexoraAccentLight: "#F472B6",
      fexoraBg: "#0F0F0F",
      fexoraSurface: "#1A1A2E",
      fexoraBorder: "#2D2D44",
    },
  },
});

export type FexoraConfig = typeof fexoraConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends FexoraConfig {}
}

export default fexoraConfig;
