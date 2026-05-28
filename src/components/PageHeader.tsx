"use client";

import { motion } from "framer-motion";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: Props) {
  return (
    <header className="flex flex-col gap-3">
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-600"
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.05 }}
        className="text-[28px] sm:text-[32px] lg:text-[40px] font-semibold tracking-[-0.02em] text-ink leading-[1.1]"
      >
        {title}
      </motion.h1>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="text-[15px] lg:text-[16px] text-ink-3 max-w-[52ch] leading-relaxed"
        >
          {description}
        </motion.p>
      )}
      {children && <div className="mt-2">{children}</div>}
    </header>
  );
}
