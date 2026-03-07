"use client"

import { FADE_AND_SCALE_ANIMATE, FADE_AND_SCALE_DOWN_INITIAL, FADE_AND_SCALE_UP_INITIAL } from "@/config/site"
import { motion } from "framer-motion"
import React from "react"

export default function AnimatedSection({ animate, children }: {
  animate: "up" | "down"
  children: React.ReactNode
}) {
  return (
    <motion.section
      initial={animate == 'up' ? FADE_AND_SCALE_UP_INITIAL : FADE_AND_SCALE_DOWN_INITIAL}
      animate={FADE_AND_SCALE_ANIMATE}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.section>
  )
}
