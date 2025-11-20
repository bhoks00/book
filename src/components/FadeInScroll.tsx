"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

export default function FadeInOnScroll({ children }: any) {
  const ref = useRef(null);

  const inView = useInView(ref, {
    margin: "10% 0px -10% 0px", 
    amount: 0.05,
    once: false,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
