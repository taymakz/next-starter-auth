"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const isAppearanceTransition =
    typeof document !== "undefined" &&
    // @ts-expect-error: Transition API
    document.startViewTransition &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function toggle(event?: MouseEvent) {
    if (!isAppearanceTransition || !event) {
      theme === "dark" ? setTheme("light") : setTheme("dark");
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );
    const transition = document.startViewTransition(async () => {
      theme === "dark" ? setTheme("light") : setTheme("dark");
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: theme === "light" ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 500,
          easing: "ease-in",
          pseudoElement:
            theme === "light"
              ? "::view-transition-old(root)"
              : "::view-transition-new(root)",
        },
      );
    });
  }
  return (
    <div>
      <button
        onClick={(e: any) => toggle(e)}
        className="rounded-lg border p-2 text-muted-foreground duration-200 bg-muted"
      >
        <Sun className="hidden dark:block" size={22} />

        <Moon className="dark:hidden" size={22} />
      </button>
    </div>
  );
}
