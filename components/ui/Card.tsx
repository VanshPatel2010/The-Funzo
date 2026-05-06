"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/helpers";

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  hover?: boolean;
}

export default function Card({
  children,
  className,
  hover = true,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "rounded-2xl bg-white border border-secondary-100 shadow-sm overflow-hidden transition-shadow duration-300",
        hover && "hover:shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
