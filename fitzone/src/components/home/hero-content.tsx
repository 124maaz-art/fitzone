"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 1, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroContent({ title, description }: { title: string; description: string }) {
  const words = title.split(" ");

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-2xl"
    >
      <motion.p
        variants={item}
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent backdrop-blur"
      >
        <Sparkles className="h-4 w-4" /> Premium Fitness Club
      </motion.p>

      <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 1, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className={`inline-block ${i >= 2 ? "text-gradient" : ""}`}
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </h1>

      <motion.p
        variants={item}
        className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-300 sm:text-xl"
      >
        {description}
      </motion.p>

      <motion.div variants={item} className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/booking"
          className={buttonVariants({ size: "lg", className: "group rounded-full" })}
        >
          Book a Session
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/programs"
          className={`${buttonVariants({ variant: "outline", size: "lg" })} rounded-full`}
        >
          Explore Programs
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce text-muted md:block"
        aria-hidden
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </motion.div>
  );
}
