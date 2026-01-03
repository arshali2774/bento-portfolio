"use client";
import Image from "next/image";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(CustomEase, SplitText);
CustomEase.create("hop", "0.85,0,0.15,1");

// Export handle type for parent to trigger animation
export interface BentoGridHandle {
  triggerExplosion: () => gsap.core.Timeline;
  getHeroImageTarget: () => DOMRect | null;
}

const BentoGrid = forwardRef<BentoGridHandle>((_, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const heroImagePlaceholderRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const textRefs = useRef<HTMLElement[]>([]);
  const arrowRef = useRef<SVGSVGElement | null>(null);
  const splitInstances = useRef<SplitText[]>([]);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    // Returns the target position for the hero image
    getHeroImageTarget: () => {
      return heroImagePlaceholderRef.current?.getBoundingClientRect() || null;
    },

    // Trigger explosion animation for cards (NOT the hero image - that's handled by hero.tsx)
    triggerExplosion: () => {
      const tl = gsap.timeline();

      // Make container visible instantly
      gsap.set(containerRef.current, { opacity: 1 });

      // Cards burst out with staggered random effect
      tl.to(cardRefs.current, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "hop",
        stagger: {
          amount: 0.3,
          from: "random",
        },
      });

      // Animate all text elements after cards settle
      const allWords = splitInstances.current.flatMap((split) => split.words);
      tl.to(
        allWords,
        {
          y: "0%",
          duration: 0.6,
          ease: "power3.out",
          stagger: {
            amount: 0.4,
            from: "center",
          },
        },
        "-=0.3"
      );

      // Animate arrow icon with text
      if (arrowRef.current) {
        tl.to(
          arrowRef.current,
          {
            y: "0%",
            duration: 0.6,
            ease: "power3.out",
          },
          "<"
        );
      }

      return tl;
    },
  }));

  useEffect(() => {
    // Set initial state: all cards at center, scaled down to hide behind hero
    cardRefs.current.forEach((card) => {
      if (card) {
        // Calculate offset from center based on final position
        const rect = card.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        gsap.set(card, {
          x: centerX - cardCenterX,
          y: centerY - cardCenterY,
          scale: 0.3,
        });
      }
    });

    // Split all text elements and set initial state
    textRefs.current.forEach((el) => {
      if (el) {
        const split = SplitText.create(el, {
          type: "words",
          mask: "words",
          wordsClass: "bento-word",
        });
        splitInstances.current.push(split);
      }
    });

    // Cleanup
    return () => {
      splitInstances.current.forEach((split) => split.revert());
      splitInstances.current = [];
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="bento-container fixed inset-0 w-full h-screen p-13.75 z-20 pointer-events-none opacity-0"
    >
      {/* Grid Layout */}
      <div
        className="bento-grid w-full h-full grid grid-cols-12 gap-8.5"
        style={{ gridTemplateRows: "0.6fr 1fr 1fr 1fr 1fr 1fr" }}
      >
        {/* Row 1 */}
        {/* Logo Card */}
        <div
          className="bento-card col-span-2 row-span-1 bg-[#171511] rounded-2xl will-change-transform pointer-events-auto flex items-center justify-center"
          ref={(el) => {
            if (el) cardRefs.current[0] = el;
          }}
        >
          <span
            className="bento-text text-[#A9977B] text-5xl font-manufacturing-consent"
            ref={(el) => {
              if (el) textRefs.current[0] = el;
            }}
          >
            Arsh Ali
          </span>
        </div>

        {/* Nav Card - starts at col 6, aligned with "What do I do" below */}
        <div
          className="bento-card col-start-6 col-span-5 row-span-1 bg-[#171511] rounded-2xl will-change-transform pointer-events-auto flex items-center justify-around px-8"
          ref={(el) => {
            if (el) cardRefs.current[1] = el;
          }}
        >
          <span
            className="bento-text text-[#A9977B] text-2xl"
            ref={(el) => {
              if (el) textRefs.current[1] = el;
            }}
          >
            Home
          </span>
          <span
            className="bento-text text-[#A9977B] text-2xl"
            ref={(el) => {
              if (el) textRefs.current[2] = el;
            }}
          >
            About
          </span>
          <span
            className="bento-text text-[#A9977B] text-2xl"
            ref={(el) => {
              if (el) textRefs.current[3] = el;
            }}
          >
            Work
          </span>
        </div>

        {/* Hire Me Button */}
        <div
          className="bento-card col-start-11 col-span-2 row-span-1 bg-[#171511] rounded-2xl will-change-transform pointer-events-auto flex items-center justify-center"
          ref={(el) => {
            if (el) cardRefs.current[2] = el;
          }}
        >
          <span
            className="bento-text text-[#A9977B] text-2xl"
            ref={(el) => {
              if (el) textRefs.current[4] = el;
            }}
          >
            Wanna Hire Me?
          </span>
        </div>

        {/* Row 2-4 */}
        {/* What do I like Card (tall) */}
        <div
          className="bento-card col-span-5 row-span-3 bg-[#171511] rounded-2xl will-change-transform pointer-events-auto p-8 flex flex-col justify-between"
          ref={(el) => {
            if (el) cardRefs.current[3] = el;
          }}
        >
          <span
            className="bento-text text-[#A9977B] text-2xl"
            ref={(el) => {
              if (el) textRefs.current[5] = el;
            }}
          >
            What do I like?
          </span>
          <div className="text-[#A9977B]">
            <p
              className="bento-text text-5xl leading-tight font-limelight"
              ref={(el) => {
                if (el) textRefs.current[6] = el;
              }}
            >
              Exploring
            </p>
            <p
              className="bento-text text-5xl leading-tight font-instrument-serif"
              ref={(el) => {
                if (el) textRefs.current[7] = el;
              }}
            >
              Ideas
            </p>
            <p
              className="bento-text text-5xl leading-tight font-inter"
              ref={(el) => {
                if (el) textRefs.current[8] = el;
              }}
            >
              Building
            </p>
            <p
              className="bento-text text-5xl leading-tight font-source-code-pro"
              ref={(el) => {
                if (el) textRefs.current[9] = el;
              }}
            >
              Things
            </p>
          </div>
        </div>

        {/* What do I do Card (tall) - starts at col 6, aligned with Nav above */}
        <div
          className="bento-card col-start-6 col-span-4 row-span-3 bg-[#171511] rounded-2xl will-change-transform pointer-events-auto p-8 flex flex-col justify-between"
          ref={(el) => {
            if (el) cardRefs.current[4] = el;
          }}
        >
          <p
            className="bento-text text-[#A9977B] leading-relaxed font-instrument-serif text-3xl"
            ref={(el) => {
              if (el) textRefs.current[10] = el;
            }}
          >
            From rough ideas to production-ready apps, creativity and
            engineering come together to build fast, intuitive, and reliable web
            experiences.
          </p>
          <span
            className="bento-text text-[#A9977B] text-2xl"
            ref={(el) => {
              if (el) textRefs.current[11] = el;
            }}
          >
            What do I do?
          </span>
        </div>

        {/* Contact Card */}
        <div
          className="bento-card col-start-10 col-span-3 row-span-2 bg-[#171511] rounded-2xl will-change-transform pointer-events-auto p-6 flex flex-col justify-between"
          ref={(el) => {
            if (el) cardRefs.current[5] = el;
          }}
        >
          <span
            className="bento-text text-[#A9977B] text-2xl"
            ref={(el) => {
              if (el) textRefs.current[12] = el;
            }}
          >
            Looking for me
          </span>
          <div className="flex items-center">
            <span
              className="bento-text text-[#A9977B] text-3xl font-instrument-serif"
              ref={(el) => {
                if (el) textRefs.current[13] = el;
              }}
            >
              Contact Me
            </span>
            <div className="overflow-hidden ml-1">
              <ArrowUpRight
                ref={arrowRef}
                className="w-6 h-6 text-[#A9977B] translate-y-full"
              />
            </div>
          </div>
        </div>

        {/* Hero Image Placeholder - invisible, just marks the position */}
        <div
          className="col-start-10 col-span-3 row-span-3 rounded-2xl"
          ref={heroImagePlaceholderRef}
        />

        {/* Row 5-6 */}
        {/* Small Image (bottom left) */}
        <div
          className="bento-card relative col-span-3 row-span-2 bg-[#171511] rounded-2xl overflow-hidden will-change-transform pointer-events-auto"
          ref={(el) => {
            if (el) cardRefs.current[6] = el;
          }}
        >
          <Image
            src="/img_2.jpg"
            alt="Small"
            fill
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#171511] mix-blend-color" />
        </div>

        {/* Projects Card */}
        <div
          className="bento-card col-start-4 col-span-6 row-span-2 bg-[#171511] rounded-2xl will-change-transform pointer-events-auto p-8 flex flex-col justify-between"
          ref={(el) => {
            if (el) cardRefs.current[7] = el;
          }}
        >
          <span
            className="bento-text text-[#A9977B] text-2xl"
            ref={(el) => {
              if (el) textRefs.current[14] = el;
            }}
          >
            Wanna check out my projects?
          </span>
          <div className="grid grid-cols-2 gap-4 text-[#A9977B]">
            <span
              className="bento-text text-3xl font-instrument-serif"
              ref={(el) => {
                if (el) textRefs.current[15] = el;
              }}
            >
              Project 1
            </span>
            <span
              className="bento-text text-3xl font-instrument-serif"
              ref={(el) => {
                if (el) textRefs.current[16] = el;
              }}
            >
              Project 1
            </span>
            <span
              className="bento-text text-3xl font-instrument-serif"
              ref={(el) => {
                if (el) textRefs.current[17] = el;
              }}
            >
              Project 1
            </span>
            <span
              className="bento-text text-3xl font-instrument-serif"
              ref={(el) => {
                if (el) textRefs.current[18] = el;
              }}
            >
              Project 1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

BentoGrid.displayName = "BentoGrid";

export default BentoGrid;
