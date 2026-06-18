"use client";
import Image from "next/image";
import { gsap, SplitText } from "@/lib/gsap";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ArrowUpRight } from "lucide-react";
import { ContactCard } from "@/components/contact-card";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiRust,
  SiTailwindcss,
  SiGreensock,
  SiFramer,
  SiGraphql,
  SiSupabase,
  SiMongodb,
} from "react-icons/si";
import { ThemeCycler } from "@/components/ui/theme-cycler";
import { cn } from "@/lib/utils";

export interface BentoGridHandle {
  triggerExplosion: () => gsap.core.Timeline;
  getHeroImageTarget: () => DOMRect | null;
}

interface BentoGridProps {
  animated?: boolean;
  onAboutClick?: () => void;
}

const BentoGrid = forwardRef<BentoGridHandle, BentoGridProps>(
  ({ animated = true, onAboutClick }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const heroImagePlaceholderRef = useRef<HTMLDivElement | null>(null);
    const cardRefs = useRef<HTMLDivElement[]>([]);
    const textRefs = useRef<HTMLElement[]>([]);
    const arrowRef = useRef<HTMLDivElement | null>(null);
    const splitInstances = useRef<SplitText[]>([]);
    const iconRefs = useRef<HTMLElement[]>([]);
    const pillRefs = useRef<HTMLElement[]>([]);

    const resetSplitText = useCallback(() => {
      splitInstances.current.forEach((split) => split.revert());
      splitInstances.current = [];
    }, []);

    const setCardsToCenter = useCallback(() => {
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length === 0) return;

      gsap.set(cards, { clearProps: "transform" });

      cards.forEach((card) => {
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
      });
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        getHeroImageTarget: () => {
          if (!animated) return null;
          return (
            heroImagePlaceholderRef.current?.getBoundingClientRect() || null
          );
        },
        triggerExplosion: () => {
          const tl = gsap.timeline();
          if (!animated) return tl;

          setCardsToCenter();
          gsap.set(containerRef.current, { opacity: 1 });

          tl.to(cardRefs.current, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "hop",
            stagger: { amount: 0.3, from: "random" },
          });

          const allWords = splitInstances.current.flatMap(
            (split) => split.words,
          );
          tl.to(
            allWords,
            {
              y: "0%",
              duration: 0.6,
              ease: "power3.out",
              stagger: { amount: 0.4, from: "center" },
            },
            "-=0.3",
          );

          const icons = iconRefs.current.filter(Boolean);
          if (icons.length > 0) {
            tl.to(
              icons,
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.04,
                ease: "power3.out",
              },
              "<",
            );
          }

          const pills = pillRefs.current.filter(Boolean);
          if (pills.length > 0) {
            tl.to(
              pills,
              { opacity: 1, duration: 0.4, stagger: 0.04, ease: "power2.out" },
              "<",
            );
          }

          if (arrowRef.current) {
            tl.to(
              arrowRef.current,
              { y: "0%", duration: 0.6, ease: "power3.out" },
              "<",
            );
          }

          return tl;
        },
      }),
      [animated, setCardsToCenter],
    );

    useLayoutEffect(() => {
      if (!animated) {
        resetSplitText();
        if (containerRef.current)
          gsap.set(containerRef.current, { opacity: 1 });
        if (cardRefs.current.length > 0)
          gsap.set(cardRefs.current, { clearProps: "transform" });
        if (arrowRef.current)
          gsap.set(arrowRef.current, { clearProps: "transform" });
        gsap.set(iconRefs.current.filter(Boolean), {
          clearProps: "opacity,transform",
        });
        gsap.set(pillRefs.current.filter(Boolean), { clearProps: "opacity" });
        return;
      }

      setCardsToCenter();
      resetSplitText();
      gsap.set(iconRefs.current.filter(Boolean), { opacity: 0, y: 6 });
      gsap.set(pillRefs.current.filter(Boolean), { opacity: 0 });
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

      return () => {
        resetSplitText();
      };
    }, [animated, resetSplitText, setCardsToCenter]);

    // Base card — all cards share this
    const card =
      "bento-card bg-[var(--theme-card)] border border-[var(--theme-text)]/8 rounded-2xl will-change-transform pointer-events-auto";
    // Interactive card
    const cardInteractive = `${card} cursor-pointer`;

    return (
      <div
        ref={containerRef}
        className={cn(
          "bento-container w-full",
          animated
            ? "fixed inset-0 h-screen p-13.75 z-20 pointer-events-none opacity-0"
            : "bento-static relative min-h-screen p-4 sm:p-6 opacity-100",
        )}
        style={{ backgroundColor: "var(--theme-bg)" }}
      >
        <div
          className={cn(
            "bento-grid w-full",
            animated
              ? "h-full grid grid-cols-12 gap-8.5"
              : "mx-auto flex max-w-2xl flex-col gap-4 sm:gap-5",
          )}
          style={
            animated
              ? { gridTemplateRows: "0.6fr 1fr 1fr 1fr 1fr 1fr" }
              : undefined
          }
        >
          {/* ── Row 1 ── */}

          {/* Logo — not interactive */}
          <div
            className={cn(
              card,
              "col-span-2 row-span-1 flex items-center justify-center",
              !animated && "min-h-24 px-6 text-center",
            )}
            ref={(el) => {
              if (el) cardRefs.current[0] = el;
            }}
          >
            <span
              className="bento-text text-[var(--theme-text)] text-5xl font-manufacturing-consent"
              ref={(el) => {
                if (el) textRefs.current[0] = el;
              }}
            >
              Arsh Ali
            </span>
          </div>

          {/* Nav — outer card is one block; each link gets its own hover box */}
          <div
            className={cn(
              card,
              "col-start-6 col-span-3 row-span-1 flex overflow-hidden",
              !animated && "min-h-20",
            )}
            ref={(el) => {
              if (el) cardRefs.current[1] = el;
            }}
          >
            <span className="nav-link group" onClick={() => onAboutClick?.()}>
              <span className="relative inline-block">
                <span
                  className="bento-text text-[var(--theme-text)] text-2xl"
                  ref={(el) => {
                    if (el) textRefs.current[1] = el;
                  }}
                >
                  About
                </span>
                <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full bg-[var(--theme-text)] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </span>
            </span>
            <span
              className="nav-link group"
              onClick={() => window.open("https://github.com/arshali2774", "_blank", "noopener,noreferrer")}
            >
              <span className="relative inline-block">
                <span
                  className="bento-text text-[var(--theme-text)] text-2xl"
                  ref={(el) => {
                    if (el) textRefs.current[2] = el;
                  }}
                >
                  Work
                </span>
                <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full bg-[var(--theme-text)] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </span>
            </span>
          </div>

          {/*
            Hire Me + Theme Cycler.
            Desktop: display:contents so children sit in the grid individually.
            Mobile:  flex row with justify-between.
          */}
          <div
            className={cn(
              animated
                ? "contents"
                : "flex flex-row items-stretch justify-between gap-3 min-h-20",
            )}
          >
            {/* Hire Me — interactive */}
            <div
              className={cn(
                cardInteractive,
                animated &&
                  "col-start-9 col-span-3 row-span-1 flex items-center justify-center",
                !animated && "px-6 flex items-center",
                "group",
              )}
              ref={(el) => {
                if (el) cardRefs.current[2] = el;
              }}
              onClick={() => window.open("https://drive.google.com/file/d/1hP_AxUP0y-69yIU5ZVpBbelyoJ6O3A2p/view?usp=drive_link", "_blank", "noopener,noreferrer")}
            >
              <span className="relative inline-block">
                <span
                  className="bento-text text-[var(--theme-text)] text-2xl"
                  ref={(el) => {
                    if (el) textRefs.current[4] = el;
                  }}
                >
                  Wanna Hire Me?
                </span>
                <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full bg-[var(--theme-text)] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </span>
            </div>

            {/* Theme cycler — interactive */}
            <div
              className={cn(
                cardInteractive,
                animated && "col-start-12 col-span-1 row-span-1 aspect-square",
                "flex items-center justify-center",
                !animated && "w-16 h-16 flex-shrink-0 self-center",
              )}
              ref={(el) => {
                if (el) cardRefs.current[3] = el;
              }}
            >
              <span
                ref={(el) => {
                  if (el) pillRefs.current[12] = el;
                }}
                className="flex items-center justify-center w-full h-full"
              >
                <ThemeCycler size={animated ? 40 : 24} />
              </span>
            </div>
          </div>

          {/* ── Rows 2–4 ── */}

          {/* What do I like — not interactive */}
          <div
            className={cn(
              card,
              "col-span-5 row-span-3 p-8 flex flex-col justify-between",
              !animated && "min-h-72 gap-10",
            )}
            ref={(el) => {
              if (el) cardRefs.current[5] = el;
            }}
          >
            <span
              className="bento-text text-[var(--theme-text)] text-2xl"
              ref={(el) => {
                if (el) textRefs.current[5] = el;
              }}
            >
              What do I like?
            </span>
            <div className="text-[var(--theme-text)]">
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

          {/* Tech stack — not interactive */}
          <div
            className={cn(
              card,
              "col-start-6 col-span-4 row-span-3 p-8 flex flex-col justify-between",
              !animated && "min-h-72 gap-10",
            )}
            ref={(el) => {
              if (el) cardRefs.current[6] = el;
            }}
          >
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { Icon: SiReact, label: "React", idx: 10 },
                  { Icon: SiNextdotjs, label: "Next.js", idx: 11 },
                  { Icon: SiTypescript, label: "TypeScript", idx: 19 },
                  { Icon: SiJavascript, label: "JavaScript", idx: 20 },
                  { Icon: SiNodedotjs, label: "Node.js", idx: 21 },
                  { Icon: SiRust, label: "Rust", idx: 22 },
                  { Icon: SiTailwindcss, label: "Tailwind CSS", idx: 26 },
                  { Icon: SiGreensock, label: "GSAP", idx: 27 },
                  { Icon: SiFramer, label: "Framer Motion", idx: 28 },
                  { Icon: SiGraphql, label: "GraphQL", idx: 29 },
                  { Icon: SiSupabase, label: "Supabase", idx: 30 },
                  { Icon: SiMongodb, label: "MongoDB", idx: 31 },
                ] as const
              ).map(({ Icon, label, idx }, i) => (
                <div
                  key={label}
                  ref={(el) => {
                    if (el) pillRefs.current[i] = el;
                  }}
                  className="skill-pill flex items-center gap-2 px-3 py-2 cursor-default border border-[var(--theme-text)]/8"
                >
                  <span
                    ref={(el) => {
                      if (el) iconRefs.current[i] = el as HTMLElement;
                    }}
                    className="flex-shrink-0 inline-flex items-center"
                  >
                    <Icon size={26} className="text-[var(--theme-text)]" />
                  </span>
                  <span
                    className="bento-text text-[var(--theme-text)] text-2xl font-instrument-serif"
                    ref={(el) => {
                      if (el) textRefs.current[idx] = el;
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <span
              className="bento-text text-[var(--theme-text)] text-2xl"
              ref={(el) => {
                if (el) textRefs.current[23] = el;
              }}
            >
              What am I good at?
            </span>
          </div>

          {/* Contact — morph card */}
          <ContactCard
            animated={animated}
            setCardRef={(el) => { if (el) cardRefs.current[7] = el; }}
            setTextRef12={(el) => { if (el) textRefs.current[12] = el; }}
            setTextRef13={(el) => { if (el) textRefs.current[13] = el; }}
            arrowRef={arrowRef}
          />

          {/* Hero image placeholder (desktop) / photo card (mobile) — not interactive */}
          {animated ? (
            <div
              className="col-start-10 col-span-3 row-span-3 rounded-2xl"
              ref={heroImagePlaceholderRef}
            />
          ) : (
            <div className="bento-card relative min-h-96 overflow-hidden rounded-2xl bg-[var(--theme-card)] border border-[var(--theme-text)]/8">
              <Image
                src="/img_1.jpg"
                alt="Arsh Ali"
                fill
                className="h-full w-full object-cover"
                priority
              />
              <div
                className="absolute inset-0 mix-blend-color"
                style={{ backgroundColor: "var(--theme-text)" }}
              />
            </div>
          )}

          {/* ── Rows 5–6 ── */}

          {/* What do I do — moved to bottom left */}
          <div
            className={cn(
              card,
              "col-span-3 row-span-2 p-6 flex flex-col justify-between",
              !animated && "min-h-60 gap-6",
            )}
            ref={(el) => {
              if (el) cardRefs.current[8] = el;
            }}
          >
            <p
              className="bento-text text-[var(--theme-text)] leading-relaxed font-instrument-serif text-3xl"
              ref={(el) => {
                if (el) textRefs.current[24] = el;
              }}
            >
              From rough ideas to production-ready apps, creativity and
              engineering come together to build fast, intuitive, and reliable
              web experiences.
            </p>
            <span
              className="bento-text text-[var(--theme-text)] text-2xl"
              ref={(el) => {
                if (el) textRefs.current[25] = el;
              }}
            >
              What do I do?
            </span>
          </div>

          {/* Projects — not interactive for now */}
          <div
            className={cn(
              card,
              "col-start-4 col-span-6 row-span-2 p-8 flex flex-col justify-between",
              !animated && "min-h-72 gap-10",
            )}
            ref={(el) => {
              if (el) cardRefs.current[9] = el;
            }}
          >
            <span
              className="bento-text text-[var(--theme-text)] text-2xl"
              ref={(el) => {
                if (el) textRefs.current[14] = el;
              }}
            >
              Wanna check out my projects?
            </span>
            <div className="grid grid-cols-1 gap-2 text-[var(--theme-text)] sm:grid-cols-2">
              <div className="project-item cursor-pointer group">
                <span className="relative inline-block">
                  <span
                    className="bento-text text-3xl font-instrument-serif"
                    ref={(el) => {
                      if (el) textRefs.current[15] = el;
                    }}
                  >
                    Project 1
                  </span>
                  <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full bg-[var(--theme-text)] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </span>
              </div>
              <div className="project-item cursor-pointer group">
                <span className="relative inline-block">
                  <span
                    className="bento-text text-3xl font-instrument-serif"
                    ref={(el) => {
                      if (el) textRefs.current[16] = el;
                    }}
                  >
                    Project 2
                  </span>
                  <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full bg-[var(--theme-text)] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </span>
              </div>
              <div className="project-item cursor-pointer group">
                <span className="relative inline-block">
                  <span
                    className="bento-text text-3xl font-instrument-serif"
                    ref={(el) => {
                      if (el) textRefs.current[17] = el;
                    }}
                  >
                    Project 3
                  </span>
                  <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full bg-[var(--theme-text)] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </span>
              </div>
              <div className="project-item cursor-pointer group">
                <span className="relative inline-block">
                  <span
                    className="bento-text text-3xl font-instrument-serif"
                    ref={(el) => {
                      if (el) textRefs.current[18] = el;
                    }}
                  >
                    Project 4
                  </span>
                  <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full bg-[var(--theme-text)] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

BentoGrid.displayName = "BentoGrid";
export default BentoGrid;
