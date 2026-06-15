"use client";
import { useTheme } from "@/components/theme-provider";
import { Paintbrush } from "@/components/animate-ui/icons/paintbrush";

export function ThemeCycler({ size = 40 }: { size?: number }) {
  const { cycleTheme } = useTheme();

  return (
    <button
      onClick={cycleTheme}
      aria-label="Switch theme"
      className="flex h-full w-full items-center justify-center focus:outline-none cursor-pointer"
    >
      <Paintbrush
        animateOnHover
        size={size}
        className="text-[var(--theme-text)]"
      />
    </button>
  );
}
