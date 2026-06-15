"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useTheme } from "./theme-provider";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.85,0,0.15,1");

// Hidden polygon (line at bottom of screen, not visible)
const HIDDEN = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
// Full screen polygon (covers everything)
const FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
// Wiped away polygon (line at top, like hero reveal)
const WIPED = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";

export function WipeOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { registerWipe } = useTheme();

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    registerWipe((accentColor: string, onMidpoint: () => void) => {
      // Reset to hidden state
      gsap.set(el, {
        clipPath: HIDDEN,
        backgroundColor: accentColor,
        pointerEvents: "all",
      });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(el, { pointerEvents: "none" });
        },
      });

      // Rise up from bottom to cover full screen
      tl.to(el, {
        clipPath: FULL,
        duration: 0.55,
        ease: "hop",
      })
        // Swap colors at midpoint (screen fully covered)
        .call(onMidpoint)
        // Wipe away upward — same motion as hero reveal
        .to(el, {
          clipPath: WIPED,
          duration: 0.55,
          ease: "hop",
        });
    });
  }, [registerWipe]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] pointer-events-none will-change-[clip-path]"
      style={{ clipPath: HIDDEN }}
    />
  );
}
