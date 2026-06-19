"use client";
import Hero from "@/components/hero";
import BentoGrid, { BentoGridHandle } from "@/components/bento-grid";
import { AboutOverlay } from "@/components/about-overlay";
import { useCallback, useEffect, useRef, useState } from "react";

const ANIMATED_LAYOUT_QUERY = "(min-width: 1280px) and (min-height: 720px)";

export default function Home() {
  const bentoGridRef = useRef<BentoGridHandle>(null);
  const [canUseAnimatedLayout, setCanUseAnimatedLayout] = useState<boolean | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [introCompleted, setIntroCompleted] = useState(false);
  const STORAGE_KEY = "bento-intro-completed";

  useEffect(() => {
    const mediaQuery = window.matchMedia(ANIMATED_LAYOUT_QUERY);
    const initiallyDesktop = mediaQuery.matches;

    if (initiallyDesktop) {
      // Refreshed on desktop → always replay intro, clear any stored flag
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      // Refreshed on mobile/tablet → honour stored flag so resize-back skips intro
      if (sessionStorage.getItem(STORAGE_KEY) === "true") {
        setIntroCompleted(true);
      }
    }

    setCanUseAnimatedLayout(initiallyDesktop);
    const onChange = (e: MediaQueryListEvent) => setCanUseAnimatedLayout(e.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setIntroCompleted(true);
  }, []);

  const getHeroImageTarget = useCallback(() => {
    return bentoGridRef.current?.getHeroImageTarget() || null;
  }, []);

  const getImageCardRect = useCallback(() => {
    return bentoGridRef.current?.getHeroImageTarget() || null;
  }, []);

  const handleHeroImageMoved = useCallback(() => {
    // Trigger bento cards explosion when hero image starts moving
    bentoGridRef.current?.triggerExplosion();
  }, []);

  if (canUseAnimatedLayout === null) {
    return <div className="min-h-screen" style={{ backgroundColor: "var(--theme-bg)" }} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--theme-bg)" }}>
      <BentoGrid
        ref={bentoGridRef}
        animated={canUseAnimatedLayout}
        introCompleted={introCompleted}
        onAboutClick={() => setAboutOpen(true)}
      />
      {canUseAnimatedLayout && !introCompleted && (
        <Hero
          getHeroImageTarget={getHeroImageTarget}
          onHeroImageMoved={handleHeroImageMoved}
          onAnimationComplete={handleIntroComplete}
        />
      )}
      <AboutOverlay
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
        getImageCardRect={getImageCardRect}
        animated={canUseAnimatedLayout ?? false}
      />
    </div>
  );
}
