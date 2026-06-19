"use client";
import Image from "next/image";
import { gsap, SplitText } from "@/lib/gsap";
import { useEffect, useRef } from "react";

const HERO_IMG_INDEX = 2;

interface HeroProps {
  onAnimationComplete?: () => void;
  getHeroImageTarget?: () => DOMRect | null;
  onHeroImageMoved?: () => void;
}

export default function Hero({
  onAnimationComplete,
  getHeroImageTarget,
  onHeroImageMoved,
}: HeroProps) {
  const counterRef = useRef<HTMLHeadingElement | null>(null);
  const headerRef = useRef<HTMLHeadingElement | null>(null);
  const overlayTextRef = useRef<HTMLDivElement | null>(null);
  const imgRefs = useRef<HTMLDivElement[]>([]);
  const heroImgRef = useRef<HTMLDivElement | null>(null);
  const heroOverlayRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const counter = { value: 0 };
    if (
      !counterRef.current ||
      !headerRef.current ||
      !overlayTextRef.current ||
      !heroImgRef.current ||
      !heroOverlayRef.current ||
      imgRefs.current.length === 0
    )
      return;

    // split the header text into words
    const split = SplitText.create(headerRef.current, {
      type: "words",
      mask: "words",
      wordsClass: "word",
    });

    //  GSAP timelines
    const counterTl = gsap.timeline({ delay: 0.5 });
    const overlayTextTl = gsap.timeline({ delay: 0.75 });
    const revealTl = gsap.timeline({ delay: 0.5 });

    // counter animation
    counterTl.to(counter, {
      value: 100,
      duration: 5,
      onUpdate() {
        counterRef.current!.textContent = Math.floor(counter.value).toString();
      },
    });
    // overlay text animation
    overlayTextTl
      .to(overlayTextRef.current, {
        y: 0,
        duration: 0.75,
        ease: "hop",
      })
      .to(overlayTextRef.current, {
        y: "-3rem",
        duration: 0.75,
        ease: "hop",
        delay: 0.75,
      })
      .to(overlayTextRef.current, {
        y: "-6rem",
        duration: 0.75,
        ease: "hop",
        delay: 0.75,
      })
      .to(overlayTextRef.current, {
        y: "-9rem",
        duration: 0.75,
        ease: "hop",
        delay: 0.75,
      });
    // Filter out the hero-img (index 2) to get non-hero images
    const nonHeroImgs = imgRefs.current.filter((_, index) => index !== HERO_IMG_INDEX);
    const heroImg = imgRefs.current[HERO_IMG_INDEX];

    revealTl
      .to(imgRefs.current, {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 1,
        ease: "hop",
      })
      .to(heroImgRef.current, {
        gap: "0.75vw",
        duration: 1,
        delay: 0.5,
        ease: "hop",
      })
      .to(
        imgRefs.current,
        {
          scale: 1,
          duration: 1,
          ease: "hop",
        },
        "<"
      )
      .to(nonHeroImgs, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1,
        stagger: 0.1,
        ease: "hop",
      })
      .to(
        split.words,
        {
          y: "0",
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",
        },
        "<0.2"
      )
      .to(heroImg, {
        scale: 2,
        duration: 1,
        ease: "hop",
      })
      .to(heroOverlayRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1,
        ease: "hop",
        onComplete: () => {
          // After overlay clips away, trigger card explosion first
          onHeroImageMoved?.();

          // Then animate hero image 200ms later
          const targetRect = getHeroImageTarget?.();
          if (targetRect && heroImg) {
            const currentRect = heroImg.getBoundingClientRect();

            // Calculate the movement needed
            const deltaX =
              targetRect.left -
              currentRect.left +
              (targetRect.width - currentRect.width) / 2;
            const deltaY =
              targetRect.top -
              currentRect.top +
              (targetRect.height - currentRect.height) / 2;

            // Animate hero image to its final position
            gsap.to(heroImg, {
              x: deltaX,
              y: deltaY,
              width: targetRect.width,
              height: targetRect.height,
              scale: 1,
              borderRadius: "1rem", // matches rounded-2xl
              duration: 1,
              ease: "hop",
              onComplete: () => {
                onAnimationComplete?.();
              },
            });
          }
        },
      });
    // 🧹 cleanup — kill timelines and revert text on unmount
    return () => {
      counterTl.kill();
      overlayTextTl.kill();
      revealTl.kill();
      split.revert();
    };
  }, []); // runs once on mount

  return (
    <section className="hero relative w-full h-svh overflow-hidden">
      <div
        className="hero-overlay absolute w-full h-svh bg-(--dark) [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)] will-change-[clip-path] z-0"
        ref={heroOverlayRef}
      >
        <div className="counter absolute right-8 bottom-8 text-(--light)">
          <h1 ref={counterRef} className="text-7xl font-medium">
            0
          </h1>
        </div>
        <div className="overlay-text-container absolute top-8 left-8 h-12 overflow-hidden">
          <div
            className="overlay-text flex flex-col transform translate-y-12 will-change-transform"
            ref={overlayTextRef}
          >
            <p className="uppercase h-12 font-instrument-serif text-4xl leading-tight text-(--light)">
              Action
            </p>
            <p className="uppercase h-12 font-instrument-serif text-4xl leading-tight text-(--light)">
              Creates
            </p>
            <p className="uppercase h-12 font-instrument-serif text-4xl leading-tight text-(--light)">
              Clarity
            </p>
          </div>
        </div>
        <div className="hero-header absolute bottom-8 w-full">
          <h1
            className="uppercase text-center text-[8vw] font-bold font-outfit leading-[0.85] text-white"
            ref={headerRef}
          >
            Welcome
          </h1>
        </div>
      </div>
      <div
        className="hero-images absolute top-1/2 transform -translate-y-1/2 w-full py-8 flex justify-center gap-[10vw] will-change-[gap] z-30 pointer-events-none"
        ref={heroImgRef}
      >
        <div
          className="img relative w-[10vw] aspect-5/7 transform translate-y-1/2 scale-[0.5] [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)] will-change-[transform,opacity,clip-path] opacity-0 overflow-hidden"
          ref={(el) => {
            if (el) imgRefs.current![0] = el;
          }}
        >
          <Image
            src={"/img_3.jpg"}
            alt="Image 3"
            fill
            priority
            sizes="10vw"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#171511] mix-blend-color" />
        </div>
        <div
          className="img relative w-[10vw] aspect-5/7 transform translate-y-1/2 scale-[0.5] [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)] will-change-[transform,opacity,clip-path] opacity-0 overflow-hidden"
          ref={(el) => {
            if (el) imgRefs.current![1] = el;
          }}
        >
          <Image
            src={"/img_2.jpg"}
            alt="Image 2"
            fill
            priority
            sizes="10vw"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#171511] mix-blend-color" />
        </div>
        <div
          className="img hero-img relative w-[10vw] aspect-5/7 transform translate-y-1/2 scale-[0.5] [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)] will-change-[transform,opacity,clip-path] opacity-0 overflow-hidden"
          ref={(el) => {
            if (el) imgRefs.current![2] = el;
          }}
        >
          <Image
            src={"/img_1.jpg"}
            alt="Image 1"
            fill
            priority
            sizes="10vw"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 mix-blend-color" style={{ backgroundColor: "var(--theme-text)" }} />
        </div>
        <div
          className="img relative w-[10vw] aspect-5/7 transform translate-y-1/2 scale-[0.5] [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)] will-change-[transform,opacity,clip-path] opacity-0 overflow-hidden"
          ref={(el) => {
            if (el) imgRefs.current![3] = el;
          }}
        >
          <Image
            src={"/img_4.jpg"}
            alt="Image 4"
            fill
            priority
            sizes="10vw"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#171511] mix-blend-color" />
        </div>
        <div
          className="img relative w-[10vw] aspect-5/7 transform translate-y-1/2 scale-[0.5] [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)] will-change-[transform,opacity,clip-path] opacity-0 overflow-hidden"
          ref={(el) => {
            if (el) imgRefs.current![4] = el;
          }}
        >
          <Image
            src={"/img_5.jpg"}
            alt="Image 5"
            fill
            priority
            sizes="10vw"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#171511] mix-blend-color" />
        </div>
      </div>
    </section>
  );
}
