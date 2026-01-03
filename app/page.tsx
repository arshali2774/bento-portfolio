"use client";
import Hero from "@/components/hero";
import BentoGrid, { BentoGridHandle } from "@/components/bento-grid";
import { useRef } from "react";

export default function Home() {
  const bentoGridRef = useRef<BentoGridHandle>(null);

  const getHeroImageTarget = () => {
    return bentoGridRef.current?.getHeroImageTarget() || null;
  };

  const handleHeroImageMoved = () => {
    // Trigger bento cards explosion when hero image starts moving
    bentoGridRef.current?.triggerExplosion();
  };

  const handleAnimationComplete = () => {
    // All animations done
    console.log("All animations complete!");
  };

  return (
    <div className="bg-[#3d2b1f] min-h-screen">
      <BentoGrid ref={bentoGridRef} />
      <Hero
        getHeroImageTarget={getHeroImageTarget}
        onHeroImageMoved={handleHeroImageMoved}
        onAnimationComplete={handleAnimationComplete}
      />
    </div>
  );
}
