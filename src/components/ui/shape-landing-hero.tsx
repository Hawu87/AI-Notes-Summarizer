"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroGeometricProps {
  badge?: string;
  title1?: string;
  title2?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function HeroGeometric({
  badge = "AI Note Summarizer",
  title1 = "Turn messy notes",
  title2 = "into clear summaries",
  description = "Paste long text and get a clean summary + bullet points in seconds.",
  className,
  children,
}: HeroGeometricProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-50 to-white px-4 pt-24 pb-32 dark:from-black dark:to-zinc-950",
        className
      )}
    >
      {/* Animated geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large circle */}
        <motion.div
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-zinc-200/30 blur-3xl dark:bg-zinc-800/30"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Medium circle */}
        <motion.div
          className="absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-zinc-300/20 blur-3xl dark:bg-zinc-700/20"
          animate={{
            x: [0, -80, 0],
            y: [0, -40, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Small circle */}
        <motion.div
          className="absolute bottom-20 left-1/4 h-48 w-48 rounded-full bg-zinc-400/10 blur-2xl dark:bg-zinc-600/10"
          animate={{
            x: [0, 60, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 dark:opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center rounded-full border border-zinc-300 bg-white/80 px-4 py-1.5 text-sm font-medium text-zinc-700 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-300">
              {badge}
            </span>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          className="mt-8 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl md:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {title1}
          <br />
          <span className="bg-gradient-to-r from-zinc-600 to-zinc-400 bg-clip-text text-transparent dark:from-zinc-400 dark:to-zinc-600">
            {title2}
          </span>
        </motion.h1>

        {/* Description */}
        {description && (
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {description}
          </motion.p>
        )}

        {/* CTA Buttons */}
        {children && (
          <motion.div
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
}

