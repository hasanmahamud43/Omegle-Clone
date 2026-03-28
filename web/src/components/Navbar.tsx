'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

type NavbarProps = {
  show?: boolean;
};

function Navbar({ show = true }: NavbarProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-30 border-b border-white/10 bg-black/50 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
          <Sparkles size={18} color="white" />
        </span>
        <span className="text-lg font-semibold tracking-tight text-white">
          Icognito
        </span>
      </div>
    </motion.div>
  );
}

export default Navbar;