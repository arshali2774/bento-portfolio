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

  useEffect(() => {
    const mediaQuery = window.matchMedia(ANIMATED_LAYOUT_QUERY);
    const updateLayoutMode = () => {
      setCanUseAnimatedLayout(mediaQuery.matches);
    };

    updateLayoutMode();
    mediaQuery.addEventListener("change", updateLayoutMode);

    return () => {
      mediaQuery.removeEventListener("change", updateLayoutMode);
    };
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
        onAboutClick={() => setAboutOpen(true)}
      />
      {canUseAnimatedLayout && (
        <Hero
          getHeroImageTarget={getHeroImageTarget}
          onHeroImageMoved={handleHeroImageMoved}
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
