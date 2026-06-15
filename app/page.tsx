"use client";
import Hero from "@/components/hero";
import BentoGrid, { BentoGridHandle } from "@/components/bento-grid";
import { useCallback, useEffect, useRef, useState } from "react";

const ANIMATED_LAYOUT_QUERY = "(min-width: 1280px) and (min-height: 720px)";

export default function Home() {
  const bentoGridRef = useRef<BentoGridHandle>(null);
  const [canUseAnimatedLayout, setCanUseAnimatedLayout] = useState<
    boolean | null
  >(null);

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

  const handleHeroImageMoved = useCallback(() => {
    // Trigger bento cards explosion when hero image starts moving
    bentoGridRef.current?.triggerExplosion();
  }, []);

  const handleAnimationComplete = useCallback(() => {}, []);

  if (canUseAnimatedLayout === null) {
    return <div className="min-h-screen" style={{ backgroundColor: "var(--theme-bg)" }} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--theme-bg)" }}>
      <BentoGrid ref={bentoGridRef} animated={canUseAnimatedLayout} />
      {canUseAnimatedLayout && (
        <Hero
          getHeroImageTarget={getHeroImageTarget}
          onHeroImageMoved={handleHeroImageMoved}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
    </div>
  );
}
