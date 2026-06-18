export interface Theme {
  name: string;
  // [0] bg  [1] card  [2] text (also image tint via mix-blend-color)
  colors: [string, string, string];
}

export const themes: Theme[] = [
  { name: "forge",           colors: ["#130d0a", "#1f1510", "#f0846a"] }, // coral — bold first impression
  { name: "northern-coast",  colors: ["#0c1514", "#122420", "#b0d9cf"] }, // teal — cool, coastal
  { name: "midnight-ember",  colors: ["#0c1018", "#131c2e", "#e2c87e"] }, // amber — warm, golden
  { name: "ink-and-mist",    colors: ["#100f18", "#1a1729", "#e0ccd8"] }, // rose — soft, cool-warm
  { name: "canopy",          colors: ["#0b100a", "#131a0e", "#b0d890"] }, // green — natural, organic
  { name: "parchment",       colors: ["#110f09", "#1b1910", "#e8d4b0"] }, // cream — warm, literary
  { name: "mineral",         colors: ["#111111", "#1d1d21", "#e4e0db"] }, // neutral — minimal, clean
];

export function resolveThemeVars(theme: Theme): Record<string, string> {
  const [bg, card, text] = theme.colors;
  return {
    "--theme-bg":   bg,
    "--theme-card": card,
    "--theme-text": text,
  };
}

export const THEME_STORAGE_KEY = "portfolio-theme-state";
