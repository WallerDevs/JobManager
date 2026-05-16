"use client";

import { motion } from "framer-motion";

export function ShellContent({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-0 flex-1 overflow-y-auto p-5"
    >
      {children}
    </motion.main>
  );
}
