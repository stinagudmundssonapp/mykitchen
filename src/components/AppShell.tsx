"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Refrigerator,
  ScanLine,
  ChefHat,
  Bookmark,
  ShoppingBasket,
  SlidersHorizontal,
} from "lucide-react";

const NAV = [
  { href: "/", label: "Kjøleskap", Icon: Refrigerator },
  { href: "/scan", label: "Scan", Icon: ScanLine },
  { href: "/oppskrifter", label: "Oppskrifter", Icon: ChefHat },
  { href: "/lagret", label: "Lagret", Icon: Bookmark },
  { href: "/handleliste", label: "Handle", Icon: ShoppingBasket },
] as const;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-1 border-r border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-8">
        <div className="px-3 pb-8">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-sage-400/15 grid place-items-center ring-1 ring-sage-300/40">
              <span className="text-base">🧊</span>
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-semibold tracking-tight">
                MyKitchen
              </div>
              <div className="text-[11px] text-ink-3">
                Smartere mat hjemme
              </div>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-0.5">
          {NAV.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5",
                  "text-[14px] font-medium transition-colors duration-150",
                  active
                    ? "text-sage-700"
                    : "text-ink-2 hover:text-ink hover:bg-[var(--color-line-soft)]",
                ].join(" ")}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-sage-50 ring-1 ring-sage-100"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon
                  size={18}
                  strokeWidth={1.75}
                  className="relative z-10 shrink-0"
                />
                <span className="relative z-10">{label}</span>
              </Link>
            );
          })}

          <div className="h-px bg-[var(--color-line)] my-3 mx-3" />

          <Link
            href="/preferanser"
            className={[
              "group flex items-center gap-3 rounded-lg px-3 py-2.5",
              "text-[14px] font-medium transition-colors duration-150",
              isActive(pathname, "/preferanser")
                ? "text-sage-700 bg-sage-50"
                : "text-ink-2 hover:text-ink hover:bg-[var(--color-line-soft)]",
            ].join(" ")}
          >
            <SlidersHorizontal size={18} strokeWidth={1.75} />
            <span>Preferanser</span>
          </Link>
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-5 pt-5 pb-3 bg-cream/85 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-sage-400/15 grid place-items-center ring-1 ring-sage-300/40">
              <span className="text-sm">🧊</span>
            </div>
            <span className="text-[15px] font-semibold tracking-tight">
              MyKitchen
            </span>
          </div>
          <Link
            href="/preferanser"
            className="size-9 rounded-lg grid place-items-center text-ink-2 hover:text-ink hover:bg-[var(--color-line-soft)] transition-colors"
            aria-label="Preferanser"
          >
            <SlidersHorizontal size={18} strokeWidth={1.75} />
          </Link>
        </header>

        <main className="flex-1 pb-28 lg:pb-12">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--color-line)] bg-cream/95 backdrop-blur-md">
          <div className="grid grid-cols-5 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            {NAV.map(({ href, label, Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative flex flex-col items-center gap-1 py-2 rounded-lg"
                >
                  {active && (
                    <motion.span
                      layoutId="mobile-nav-pill"
                      className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-sage-500"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  <Icon
                    size={20}
                    strokeWidth={1.75}
                    className={
                      active ? "text-sage-700" : "text-ink-3"
                    }
                  />
                  <span
                    className={[
                      "text-[10px] font-medium tracking-tight",
                      active ? "text-sage-700" : "text-ink-3",
                    ].join(" ")}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
