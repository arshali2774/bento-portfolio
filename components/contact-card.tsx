"use client";

import { useRef, useState, useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { Mail, Phone } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";
import { toast } from "sonner";
import { ArrowLeft } from "@/components/animate-ui/icons/arrow-left";
import { ArrowUpRight as ArrowUpRightAnimated } from "@/components/animate-ui/icons/arrow-up-right";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";

type LinkContact = { id: string; Icon: React.ComponentType<{ className?: string }>; href: string; action: "link" };
type CopyContact = { id: string; Icon: React.ComponentType<{ className?: string }>; value: string; action: "copy" };
type Contact = LinkContact | CopyContact;

const CONTACTS: Contact[] = [
  { id: "discord",  Icon: SiDiscord,    href: "https://discord.com/users/1290268416858656808", action: "link" },
  { id: "linkedin", Icon: FaLinkedinIn, href: "https://www.linkedin.com/in/arshali2774",       action: "link" },
  { id: "email",    Icon: Mail,          value: "arshaliwork@gmail.com",                        action: "copy" },
  { id: "phone",    Icon: Phone,         value: "+919956440846",                                action: "copy" },
];

const GAP = 8;   // px gap between sub-cards in open state
const RADIUS = 14; // px border-radius per sub-card in open state
const COPY_LABELS: Record<string, string> = { email: "Email copied", phone: "Phone copied" };

function getSubCardBorderShadow(el: HTMLElement): string {
  const text = getComputedStyle(el).getPropertyValue("--theme-text").trim();
  if (text.startsWith("#")) {
    const hex = text.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `inset 0 0 0 1px rgba(${r}, ${g}, ${b}, 0.08)`;
  }
  return "inset 0 0 0 1px rgba(203, 213, 232, 0.08)";
}

interface ContactCardProps {
  animated?: boolean;
  setCardRef:   (el: HTMLDivElement | null) => void;
  setTextRef12: (el: HTMLElement | null) => void;
  setTextRef13: (el: HTMLElement | null) => void;
  arrowRef: React.RefObject<HTMLDivElement | null>;
}

// ── Desktop ───────────────────────────────────────────────────────────────────

export function ContactCard({
  animated = true,
  setCardRef,
  setTextRef12,
  setTextRef13,
  arrowRef,
}: ContactCardProps) {
  if (!animated) {
    return (
      <MobileContactCard
        setCardRef={setCardRef}
        setTextRef12={setTextRef12}
        setTextRef13={setTextRef13}
        arrowRef={arrowRef}
      />
    );
  }

  return <DesktopContactCard
    setCardRef={setCardRef}
    setTextRef12={setTextRef12}
    setTextRef13={setTextRef13}
    arrowRef={arrowRef}
  />;
}

function DesktopContactCard({
  setCardRef,
  setTextRef12,
  setTextRef13,
  arrowRef,
}: Omit<ContactCardProps, "animated">) {
  const isAnimating = useRef(false);
  const isOpen = useRef(false);

  const [arrowHovered, setArrowHovered] = useState(false);
  const [backHovered, setBackHovered] = useState(false);

  const wrapperRef   = useRef<HTMLDivElement>(null);
  const cardShellRef = useRef<HTMLDivElement>(null); // provides card bg/border in closed state
  const gridRef      = useRef<HTMLDivElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const subCardRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs     = useRef<(HTMLDivElement | null)[]>([]);

  // Initialise sub-card states: no gap, no radius, icons hidden
  useLayoutEffect(() => {
    const icons = iconRefs.current.filter((el): el is HTMLDivElement => el !== null);
    gsap.set(icons, { opacity: 0, scale: 0.7 });

    const cards = subCardRefs.current.filter((el): el is HTMLDivElement => el !== null);
    gsap.set(cards, { borderRadius: 0 });

    // Grid starts collapsed
    if (gridRef.current) {
      gsap.set(gridRef.current, { columnGap: 0, rowGap: 0, pointerEvents: "none" });
    }
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { pointerEvents: "auto" });
    }
  }, []);

  function handleContactClick(contact: Contact) {
    if (contact.action === "link") {
      window.open(contact.href, "_blank", "noopener,noreferrer");
    } else {
      navigator.clipboard.writeText(contact.value);
      toast(COPY_LABELS[contact.id] ?? "Copied");
    }
  }

  function handleOpen() {
    if (isOpen.current || isAnimating.current) return;
    isAnimating.current = true;

    // Immediately block the overlay so rapid clicks don't re-trigger
    gsap.set(overlayRef.current, { pointerEvents: "none" });
    gsap.set(gridRef.current,    { pointerEvents: "auto" });

    const cards = subCardRefs.current.filter((el): el is HTMLDivElement => el !== null);
    const icons = iconRefs.current.filter((el): el is HTMLDivElement => el !== null);

    const shadowFull = wrapperRef.current ? getSubCardBorderShadow(wrapperRef.current) : "inset 0 0 0 1px rgba(203, 213, 232, 0.08)";
    const shadowNone = shadowFull.replace(/[\d.]+\)$/, "0)");

    const tl = gsap.timeline({
      onComplete: () => { isOpen.current = true; isAnimating.current = false; },
    });

    // 1. Face overlay slides up & fades
    tl.to(overlayRef.current, { opacity: 0, y: -16, duration: 0.3, ease: "power2.in" });

    // 2. Card shell fades out (so bento-bg shows through the gaps)
    tl.to(cardShellRef.current, { opacity: 0, duration: 0.45, ease: "power2.out" }, 0.1);

    // 3. Gap tears open — the "split" effect
    tl.to(gridRef.current, {
      columnGap: GAP,
      rowGap: GAP,
      duration: 0.65,
      ease: "power2.inOut",
    }, 0.1);

    // 4. Sub-cards get rounded corners as they separate
    tl.to(cards, {
      borderRadius: RADIUS,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out",
    }, 0.15);

    // 5. Icons appear once cards have settled
    tl.to(icons, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      stagger: 0.07,
      ease: "back.out(1.5)",
    }, "-=0.2");

    // 6. Sub-card borders fade in after icons settle
    tl.fromTo(cards,
      { boxShadow: shadowNone },
      { boxShadow: shadowFull, duration: 0.35, stagger: 0.04, ease: "power2.out" },
      "-=0.1",
    );
  }

  function handleClose() {
    if (!isOpen.current || isAnimating.current) return;
    isAnimating.current = true;

    gsap.set(gridRef.current,    { pointerEvents: "none" });

    const cards = subCardRefs.current.filter((el): el is HTMLDivElement => el !== null);
    const icons = iconRefs.current.filter((el): el is HTMLDivElement => el !== null);

    const shadowFull = wrapperRef.current ? getSubCardBorderShadow(wrapperRef.current) : "inset 0 0 0 1px rgba(203, 213, 232, 0.08)";
    const shadowNone = shadowFull.replace(/[\d.]+\)$/, "0)");

    const tl = gsap.timeline({
      onComplete: () => {
        isOpen.current = false;
        isAnimating.current = false;
        gsap.set(overlayRef.current, { pointerEvents: "auto" });
      },
    });

    // 1. Borders + icons fade out together
    tl.to(cards, { boxShadow: shadowNone, duration: 0.2, stagger: { amount: 0.1, from: "end" }, ease: "power2.in" });
    tl.to(icons, {
      opacity: 0,
      scale: 0.7,
      duration: 0.2,
      stagger: { amount: 0.12, from: "end" },
      ease: "power2.in",
    }, 0);

    // 2. Cards lose radius as they merge
    tl.to(cards, {
      borderRadius: 0,
      duration: 0.45,
      stagger: { amount: 0.12, from: "end" },
      ease: "power2.in",
    }, "-=0.1");

    // 3. Gap closes — cards merge back into one
    tl.to(gridRef.current, {
      columnGap: 0,
      rowGap: 0,
      duration: 0.55,
      ease: "power2.inOut",
    }, "-=0.35");

    // 4. Card shell fades back in
    tl.to(cardShellRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" }, "-=0.2");

    // 5. Face overlay slides back in
    tl.fromTo(
      overlayRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
      "-=0.15",
    );
  }

  return (
    <div
      ref={(el) => { wrapperRef.current = el; setCardRef(el); }}
      className="bento-card col-start-10 col-span-3 row-span-2 relative will-change-transform pointer-events-auto rounded-2xl overflow-hidden"
    >
      {/* Sub-cards grid — always in DOM, layout animated via GSAP */}
      <div
        ref={gridRef}
        className="absolute inset-0 grid grid-cols-3 grid-rows-2"
      >
        {CONTACTS.map((contact, i) => (
          <div
            key={contact.id}
            ref={(el) => { subCardRefs.current[i] = el; }}
            onClick={() => handleContactClick(contact)}
            className="flex items-center justify-center bg-[var(--theme-card)] cursor-pointer"
          >
            <div ref={(el) => { iconRefs.current[i] = el; }} className="flex items-center justify-center">
              <contact.Icon className="w-[var(--icon-size)] h-[var(--icon-size)] text-[var(--theme-text)]" />
            </div>
          </div>
        ))}

        {/* Back button — col-span-2 */}
        <div
          ref={(el) => { subCardRefs.current[4] = el; }}
          onClick={handleClose}
          onMouseEnter={() => setBackHovered(true)}
          onMouseLeave={() => setBackHovered(false)}
          className="col-span-2 flex items-center justify-center bg-[var(--theme-card)] cursor-pointer"
        >
          <div ref={(el) => { iconRefs.current[4] = el; }} className="flex items-center justify-center">
            <AnimateIcon animate={backHovered ? "pointing-loop" : false} loop={backHovered} completeOnStop>
              <ArrowLeft className="w-[var(--icon-size)] h-[var(--icon-size)] text-[var(--theme-text)]" />
            </AnimateIcon>
          </div>
        </div>
      </div>

      {/* Card shell — sits on top of grid, covers sub-cards in closed state with bg+border */}
      <div
        ref={cardShellRef}
        className="absolute inset-0 bg-[var(--theme-card)] border border-[var(--theme-text)]/8 rounded-2xl pointer-events-none"
      />

      {/* Face overlay — contact card closed state */}
      <div
        ref={overlayRef}
        className="absolute inset-0 p-6 flex flex-col justify-between"
      >
        <span
          className="bento-text text-[var(--theme-text)] [font-size:var(--text-q)]"
          ref={setTextRef12}
        >
          Looking for me?
        </span>
        <div
          className="flex items-center cursor-pointer group"
          onClick={handleOpen}
          onMouseEnter={() => setArrowHovered(true)}
          onMouseLeave={() => setArrowHovered(false)}
        >
          <span className="relative inline-block">
            <span
              className="bento-text text-[var(--theme-text)] [font-size:var(--text-cta)] font-instrument-serif"
              ref={setTextRef13}
            >
              Contact Me
            </span>
            <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full bg-[var(--theme-text)] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
          </span>
          <div className="overflow-hidden ml-1">
            {/* GSAP animates this div (slide-up reveal); Framer Motion animates the SVG (hover) */}
            <div ref={arrowRef} className="translate-y-full">
              <AnimateIcon animate={arrowHovered ? "default" : false}>
                <ArrowUpRightAnimated className="w-[var(--icon-size)] h-[var(--icon-size)] text-[var(--theme-text)]" />
              </AnimateIcon>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mobile helpers ────────────────────────────────────────────────────────────

function MobileBackCell({ cell, onClick }: { cell: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={cn(cell, "col-span-2")}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimateIcon animate={hovered ? "pointing-loop" : false} loop={hovered} completeOnStop>
        <ArrowLeft className="w-5 h-5 text-[var(--theme-text)]" />
      </AnimateIcon>
    </div>
  );
}

// ── Mobile ────────────────────────────────────────────────────────────────────

interface MobileContactCardProps {
  setCardRef:   (el: HTMLDivElement | null) => void;
  setTextRef12: (el: HTMLElement | null) => void;
  setTextRef13: (el: HTMLElement | null) => void;
  arrowRef: React.RefObject<HTMLDivElement | null>;
}

function MobileContactCard({ setCardRef, setTextRef12, setTextRef13, arrowRef }: MobileContactCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileArrowHovered, setMobileArrowHovered] = useState(false);
  const faceRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const card = "bento-card bg-[var(--theme-card)] border border-[var(--theme-text)]/8 rounded-2xl will-change-transform pointer-events-auto";
  const cell = "flex items-center justify-center p-4 rounded-xl border border-[var(--theme-text)]/8 cursor-pointer";

  function openCard() {
    if (isOpen || !faceRef.current || !gridRef.current) return;
    const grid = gridRef.current;
    const tl = gsap.timeline({ onComplete: () => setIsOpen(true) });
    tl.to(faceRef.current, { opacity: 0, y: -10, duration: 0.25, ease: "power2.in" });
    tl.set(faceRef.current, { display: "none" });
    tl.set(grid, { display: "grid" });
    tl.fromTo(
      Array.from(grid.children),
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.35, stagger: 0.07, ease: "back.out(1.4)" },
    );
  }

  function closeCard() {
    if (!isOpen || !faceRef.current || !gridRef.current) return;
    const grid = gridRef.current;
    const tl = gsap.timeline({ onComplete: () => setIsOpen(false) });
    tl.to(
      Array.from(grid.children),
      { scale: 0.7, opacity: 0, duration: 0.2, stagger: { amount: 0.1, from: "end" }, ease: "power2.in" },
    );
    tl.set(grid, { display: "none" });
    tl.set(faceRef.current, { display: "flex", opacity: 0, y: 10 });
    tl.to(faceRef.current, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
  }

  return (
    <div className={cn(card, "p-4 flex flex-col gap-3 min-h-44")} ref={setCardRef}>

      {/* Face */}
      <div ref={faceRef} className="flex-1 flex flex-col justify-between">
        <span className="bento-text text-[var(--theme-text)] text-2xl sm:text-3xl font-instrument-serif" ref={setTextRef12}>
          Looking for me
        </span>
        <div
          className="flex items-center cursor-pointer mt-auto group"
          onClick={openCard}
          onMouseEnter={() => setMobileArrowHovered(true)}
          onMouseLeave={() => setMobileArrowHovered(false)}
        >
          <span className="relative inline-block">
            <span className="bento-text text-[var(--theme-text)] text-2xl" ref={setTextRef13}>
              Contact Me
            </span>
            <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full bg-[var(--theme-text)] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
          </span>
          <div className="overflow-hidden ml-1">
            <div ref={arrowRef}>
              <AnimateIcon animate={mobileArrowHovered ? "default" : false}>
                <ArrowUpRightAnimated className="w-[var(--icon-size)] h-[var(--icon-size)] text-[var(--theme-text)]" />
              </AnimateIcon>
            </div>
          </div>
        </div>
      </div>

      {/* Social grid */}
      <div ref={gridRef} className="flex-1 grid-cols-3 grid-rows-2 gap-2" style={{ display: "none" }}>
        {/* Row 1: Discord · LinkedIn · Email */}
        {CONTACTS.slice(0, 3).map((contact) => (
          <div
            key={contact.id}
            className={cell}
            onClick={() => {
              if (contact.action === "link") {
                window.open(contact.href, "_blank", "noopener,noreferrer");
              } else {
                navigator.clipboard.writeText(contact.value);
                toast(COPY_LABELS[contact.id] ?? "Copied");
              }
            }}
          >
            <contact.Icon className="w-5 h-5 text-[var(--theme-text)]" />
          </div>
        ))}

        {/* Row 2: Phone + Back (same row) */}
        <div
          className={cell}
          onClick={() => {
            navigator.clipboard.writeText((CONTACTS[3] as CopyContact).value);
            toast("Phone copied");
          }}
        >
          <Phone className="w-5 h-5 text-[var(--theme-text)]" />
        </div>
        <MobileBackCell cell={cell} onClick={closeCard} />
      </div>
    </div>
  );
}
