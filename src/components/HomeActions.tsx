"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScanLine, Pencil, ChefHat, ShoppingBasket } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function HomeActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease, delay: 0.15 }}
      className="flex flex-col gap-3"
    >
      <Link href="/scan" className="group">
        <div className="relative overflow-hidden rounded-2xl bg-sage-600 hover:bg-sage-700 transition-colors p-5 text-white shadow-[0_10px_30px_-12px_rgba(74,107,94,0.5)]">
          <div className="absolute -right-6 -top-6 size-32 rounded-full bg-white/5 blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="size-11 shrink-0 rounded-xl bg-white/10 ring-1 ring-white/20 grid place-items-center backdrop-blur-sm">
              <ScanLine size={20} strokeWidth={1.75} />
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-semibold tracking-tight">
                Scan kvittering
              </div>
              <div className="text-[12.5px] text-white/70 mt-0.5">
                Fyll kjøleskapet på sekunder
              </div>
            </div>
            <span className="text-white/60 group-hover:translate-x-0.5 group-hover:text-white transition-all text-lg">
              →
            </span>
          </div>
        </div>
      </Link>

      <SecondaryAction
        href="/oppskrifter"
        Icon={ChefHat}
        title="Foreslå middag"
        sub="AI-forslag fra det du har"
      />
      <SecondaryAction
        href="/handleliste"
        Icon={ShoppingBasket}
        title="Handleliste"
        sub="Det du mangler — sortert smart"
      />
      <SecondaryAction
        href="/preferanser"
        Icon={Pencil}
        title="Preferanser"
        sub="Allergier, diett, husholdning"
      />
    </motion.div>
  );
}

function SecondaryAction({
  href,
  Icon,
  title,
  sub,
}: {
  href: string;
  Icon: typeof ScanLine;
  title: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl bg-surface border border-[var(--color-line)] hover:border-sage-200 hover:shadow-[var(--shadow-sm)] transition-all p-4"
    >
      <div className="size-10 shrink-0 rounded-xl bg-sage-50 grid place-items-center text-sage-700">
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <div className="flex-1 leading-tight">
        <div className="text-[14px] font-medium text-ink">{title}</div>
        <div className="text-[12px] text-ink-3 mt-0.5">{sub}</div>
      </div>
      <span className="text-ink-4 group-hover:translate-x-0.5 group-hover:text-sage-700 transition-all">
        →
      </span>
    </Link>
  );
}
