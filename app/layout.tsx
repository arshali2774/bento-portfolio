import type { Metadata } from "next";
import {
  Instrument_Serif,
  Outfit,
  Inter,
  Source_Code_Pro,
  Karla,
  Limelight,
  Manufacturing_Consent,
} from "next/font/google";
import "./globals.css";
import { buildThemeScript } from "@/lib/theme-script";
import { ThemeProvider } from "@/components/theme-provider";
import { WipeOverlay } from "@/components/wipe-overlay";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  style: "normal",
  preload: true,
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: true,
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  preload: true,
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  preload: true,
});

const limelight = Limelight({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-limelight",
  preload: true,
});

const manufacturingConsent = Manufacturing_Consent({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-manufacturing-consent",
  preload: true,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Arsh Ali — Portfolio",
  description:
    "Full-stack web developer building fast, intuitive, and reliable web experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = buildThemeScript();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Blocking theme script — runs before first paint so there is no
          flash of wrong theme. Safe: content is built from our own static
          themes.ts data (hardcoded hex strings). No user input ever reaches
          this string. This is the standard pattern used by next-themes et al.
        */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${instrumentSerif.variable} ${outfit.variable} ${inter.variable} ${sourceCodePro.variable} ${karla.variable} ${limelight.variable} ${manufacturingConsent.variable} antialiased`}
      >
        <ThemeProvider>
          <WipeOverlay />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
