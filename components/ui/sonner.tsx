"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="bottom-center"
      duration={2000}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--theme-card)",
          "--normal-text": "var(--theme-text)",
          "--normal-border": "color-mix(in srgb, var(--theme-text) 12%, transparent)",
          "--border-radius": "0.75rem",
          "--font": "var(--font-outfit), sans-serif",
          "--toast-svg-margin-start": "-3px",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
