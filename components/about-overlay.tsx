"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "@/components/animate-ui/icons/arrow-left";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";

const IMG_W = 300;
const IMG_H = 400;
const PAD_OUTER = 55;
const PAD_INNER = 32;
const TARGET_W = 880;
const TEXT_COL_W = TARGET_W - PAD_INNER * 3 - IMG_W;
const BLEED = 2;

const TITLE = "SDE-1 at Co3 Labs";

const PARAGRAPHS: React.ReactNode[] = [
  <>I&apos;m <strong>Arsh</strong>, a full-stack developer with a <strong>B.Tech in Computer Science Engineering</strong> and hands-on experience building real products. My primary stack is <strong>JavaScript</strong> and <strong>TypeScript</strong> across the board — <strong>React</strong> and <strong>Next.js</strong> on the frontend, <strong>Node.js</strong> and <strong>Express</strong> on the backend, with <strong>MongoDB</strong> and <strong>Supabase</strong> for data. I&apos;ve also worked with <strong>GraphQL</strong>, <strong>REST APIs</strong>, and dipped into <strong>Web3</strong> and <strong>Solana</strong> development. I currently work at <strong>Co3 Labs</strong>, where I&apos;ve gone beyond tutorials and into the messy, rewarding reality of shipping features that actual users depend on.</>,
  <>Right now I&apos;m sharpening the fundamentals that separate good developers from great ones — <strong>DSA</strong>, <strong>system design</strong>, <strong>DevOps</strong>, and <strong>AI integration</strong> — through an intensive bootcamp. On the build side, I&apos;m actively developing <strong>Dua Vault</strong>, a personal web app where I&apos;m implementing authentication, search with <strong>Elasticsearch</strong>, <strong>PWA</strong>/offline support, and a spaced repetition system using the <strong>SM-2</strong> algorithm. I don&apos;t treat side projects as resume decoration; they&apos;re where I figure out what I actually don&apos;t know yet.</>,
  <>Web development isn&apos;t something I fell into by accident — it&apos;s the intersection of logical precision and tangible human impact that keeps me locked in. I care about writing code that&apos;s maintainable, not just code that works. I&apos;m the kind of developer who documents, questions trade-offs, and asks <em>why</em> before <em>how</em>. If you&apos;re looking for someone who ships consistently, keeps learning deliberately, and doesn&apos;t need hand-holding — that&apos;s the pitch.</>,
];

interface AboutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  getImageCardRect: () => DOMRect | null;
  animated: boolean;
}

// ─── Desktop overlay (GSAP-driven) ────────────────────────────────────────────

interface DesktopOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  getImageCardRect: () => DOMRect | null;
}

function DesktopOverlay({ isOpen, onClose, getImageCardRect }: DesktopOverlayProps) {
  const dimRef     = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLParagraphElement>(null);
  const paraRefs   = useRef<(HTMLParagraphElement | null)[]>([]);
  const backRef    = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [backHovered, setBackHovered] = useState(false);

  const isAnimatingRef = useRef(false);
  const prevIsOpenRef  = useRef(false);
  const getImageCardRectRef = useRef(getImageCardRect);
  getImageCardRectRef.current = getImageCardRect;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const handleCloseRef = useRef<() => void>(() => {});

  function getTextEls(): HTMLElement[] {
    return [titleRef.current, ...paraRefs.current, backRef.current as HTMLElement | null]
      .filter((el): el is HTMLElement => el !== null);
  }

  function open() {
    const rect = getImageCardRectRef.current();
    const panel = panelRef.current;
    const dim   = dimRef.current;
    const imgWrap = imgWrapRef.current;
    if (!rect || !panel || !dim) { isAnimatingRef.current = false; return; }

    const measureH       = measureRef.current?.scrollHeight ?? 0;
    const contentDrivenH = measureH + PAD_INNER * 2 + 56;
    const bentoBottom    = window.innerHeight - PAD_OUTER;
    const minH           = IMG_H + PAD_INNER * 2 + 56;
    const rawH           = Math.max(minH, contentDrivenH, bentoBottom - rect.top);
    const rawTop         = bentoBottom - rawH;
    const targetTop      = Math.max(PAD_OUTER, rawTop);
    const TARGET_H       = bentoBottom - targetTop;
    const targetLeft     = Math.max(PAD_OUTER, window.innerWidth - PAD_OUTER - TARGET_W);

    const textEls = getTextEls();

    gsap.set(panel, { display: "block", left: rect.left, top: rect.top, width: rect.width, height: rect.height, borderRadius: "1rem" });
    gsap.set(dim,     { opacity: 0, pointerEvents: "auto" });
    gsap.set(textEls, { opacity: 0, y: 14 });
    if (imgWrap) gsap.set(imgWrap, { position: "absolute", top: 0, left: 0, width: rect.width, height: rect.height, borderRadius: "0.875rem" });

    const tl = gsap.timeline({ onComplete: () => { isAnimatingRef.current = false; } });
    tl.to(dim,   { opacity: 1, duration: 0.4, ease: "power2.out" });
    tl.to(panel, { left: targetLeft, top: targetTop - BLEED, width: TARGET_W + BLEED, height: TARGET_H + BLEED * 2, borderRadius: "1.25rem", duration: 0.65, ease: "power2.inOut" }, 0.1);
    if (imgWrap) tl.to(imgWrap, { top: PAD_INNER, left: PAD_INNER, width: IMG_W, height: IMG_H, borderRadius: "0.75rem", duration: 0.65, ease: "power2.inOut" }, 0.1);
    tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.05");
    tl.to(paraRefs.current.filter(Boolean), { opacity: 1, y: 0, duration: 0.35, stagger: 0.12, ease: "power2.out" }, "-=0.15");
    tl.to(backRef.current,  { opacity: 1, y: 0, duration: 0.3,  ease: "power2.out" }, "-=0.1");
  }

  function close() {
    const rect = getImageCardRectRef.current();
    const panel = panelRef.current;
    const dim   = dimRef.current;
    const imgWrap = imgWrapRef.current;
    if (!rect || !panel || !dim) { isAnimatingRef.current = false; return; }

    const textEls = getTextEls();
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(panel, { display: "none" });
        gsap.set(dim,   { opacity: 0, pointerEvents: "none" });
        isAnimatingRef.current = false;
        onCloseRef.current();
      },
    });
    tl.to(textEls, { opacity: 0, y: 8, duration: 0.22, stagger: { amount: 0.14, from: "end" }, ease: "power2.in" });
    if (imgWrap) tl.to(imgWrap, { top: 0, left: 0, width: rect.width, height: rect.height, borderRadius: "0.875rem", duration: 0.5, ease: "power2.inOut" }, "-=0.1");
    tl.to(panel, { left: rect.left, top: rect.top, width: rect.width, height: rect.height, borderRadius: "1rem", duration: 0.55, ease: "power2.inOut" }, "-=0.4");
    tl.to(dim,   { opacity: 0, duration: 0.3, ease: "power2.out" }, "-=0.3");
  }

  function handleClose() {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    close();
  }
  handleCloseRef.current = handleClose;

  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) { isAnimatingRef.current = true; open(); }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleCloseRef.current(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <>
      <div ref={dimRef} className="fixed inset-0 z-40 bg-black/60 pointer-events-none" style={{ opacity: 0 }} onClick={() => handleCloseRef.current()} />

      <div ref={panelRef} className="fixed z-50 bg-[var(--theme-card)] border border-[var(--theme-text)]/8 overflow-hidden" style={{ display: "none" }}>
        <div ref={imgWrapRef} className="absolute overflow-hidden">
          <Image src="/img_1.jpg" alt="Arsh Ali" fill className="object-cover" priority />
          <div className="absolute inset-0 mix-blend-color" style={{ backgroundColor: "var(--theme-text)" }} />
        </div>

        <div className="absolute flex flex-col gap-5" style={{ top: PAD_INNER, left: PAD_INNER + IMG_W + PAD_INNER, right: PAD_INNER, bottom: PAD_INNER + 48 }}>
          <p ref={titleRef} className="font-instrument-serif text-3xl text-[var(--theme-text)] flex-shrink-0">{TITLE}</p>
          {PARAGRAPHS.map((text, i) => (
            <p key={i} ref={(el) => { paraRefs.current[i] = el; }} className="text-base text-[var(--theme-text)]/75 leading-relaxed flex-shrink-0">{text}</p>
          ))}
        </div>

        <div ref={backRef} className="absolute cursor-pointer rounded-full bg-[var(--theme-card)] p-2 flex items-center justify-center" style={{ bottom: PAD_INNER, left: PAD_INNER }} onClick={() => handleCloseRef.current()} onMouseEnter={() => setBackHovered(true)} onMouseLeave={() => setBackHovered(false)}>
          <AnimateIcon animate={backHovered ? "pointing-loop" : false} loop={backHovered} completeOnStop>
            <ArrowLeft className="w-8 h-8 text-[var(--theme-text)]" />
          </AnimateIcon>
        </div>
      </div>

      <div ref={measureRef} aria-hidden="true" className="pointer-events-none fixed flex flex-col gap-5" style={{ left: -9999, top: -9999, width: TEXT_COL_W, visibility: "hidden" }}>
        <p className="font-instrument-serif text-3xl leading-snug">{TITLE}</p>
        {PARAGRAPHS.map((text, i) => <p key={i} className="text-base leading-relaxed">{text}</p>)}
      </div>
    </>
  );
}

// ─── Mobile overlay (React-mounted, no GSAP visibility control) ───────────────

interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileOverlay({ isOpen, onClose }: MobileOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef  = useRef<HTMLDivElement>(null);
  const titleRef  = useRef<HTMLParagraphElement>(null);
  const paraRefs  = useRef<(HTMLParagraphElement | null)[]>([]);
  const backRef   = useRef<HTMLDivElement>(null);
  const [backHovered, setBackHovered] = useState(false);
  const closingRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (isOpen && !mounted) { closingRef.current = false; setMounted(true); }
  }, [isOpen, mounted]);

  // Text stagger in after panel mounts
  useLayoutEffect(() => {
    if (!mounted) return;
    const els = [titleRef.current, ...paraRefs.current, backRef.current as HTMLElement | null]
      .filter((el): el is HTMLElement => el !== null);
    gsap.fromTo(els, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.07, delay: 0.1, ease: "power2.out" });
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted]);

  function handleClose() {
    if (closingRef.current) return;
    closingRef.current = true;
    const els = [titleRef.current, ...paraRefs.current, backRef.current as HTMLElement | null]
      .filter((el): el is HTMLElement => el !== null);
    const tl = gsap.timeline({ onComplete: () => { setMounted(false); onCloseRef.current(); } });
    if (els.length) tl.to(els, { opacity: 0, duration: 0.15, stagger: { amount: 0.08, from: "end" } });
    if (panelRef.current) tl.to(panelRef.current, { opacity: 0, duration: 0.2 }, "-=0.05");
  }

  if (!mounted) return null;

  return (
    <>
      {/* Dim — sits behind everything */}
      <div className="fixed inset-0 z-40 bg-black/60" onClick={handleClose} />

      {/*
        Layout wrapper: transparent, pointer-events-none so clicks outside the
        panel fall through to the dim above. Padding matches the bento grid's
        p-4 sm:p-6 outer padding so the panel aligns with the card column.
      */}
      <div className="fixed inset-0 z-50 flex flex-col p-4 sm:p-6 pointer-events-none">
        <div
          ref={panelRef}
          className={cn(
            "relative w-full max-w-2xl mx-auto flex-1 flex flex-col pointer-events-auto",
            "bg-[var(--theme-card)] border border-[var(--theme-text)]/8 rounded-2xl overflow-hidden",
          )}
        >
          {/* Image */}
          <div className="relative w-full h-64 flex-shrink-0">
            <Image src="/img_1.jpg" alt="Arsh Ali" fill className="object-cover object-center" priority />
            <div className="absolute inset-0 mix-blend-color" style={{ backgroundColor: "var(--theme-text)" }} />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 pb-20 flex flex-col gap-4">
            <p ref={titleRef} className="font-instrument-serif text-2xl text-[var(--theme-text)]">{TITLE}</p>
            {PARAGRAPHS.map((text, i) => (
              <p key={i} ref={(el) => { paraRefs.current[i] = el; }} className="text-base text-[var(--theme-text)]/75 leading-relaxed">{text}</p>
            ))}
          </div>

          {/* Back button */}
          <div ref={backRef} className="absolute bottom-6 left-6 cursor-pointer rounded-full bg-[var(--theme-card)] p-2 flex items-center justify-center" onClick={handleClose} onMouseEnter={() => setBackHovered(true)} onMouseLeave={() => setBackHovered(false)}>
            <AnimateIcon animate={backHovered ? "pointing-loop" : false} loop={backHovered} completeOnStop>
              <ArrowLeft className="w-7 h-7 text-[var(--theme-text)]" />
            </AnimateIcon>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Public export ─────────────────────────────────────────────────────────────

export function AboutOverlay({ isOpen, onClose, getImageCardRect, animated }: AboutOverlayProps) {
  if (animated) {
    return <DesktopOverlay isOpen={isOpen} onClose={onClose} getImageCardRect={getImageCardRect} />;
  }
  return <MobileOverlay isOpen={isOpen} onClose={onClose} />;
}
