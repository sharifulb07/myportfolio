// components/ui/animated-counter.tsx
"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export const AnimatedCounter = ({
  value,
  duration = 2,
  suffix = "",
  prefix = "",
}: AnimatedCounterProps) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [displayValue, setDisplayValue] = useState(0);
  const count = useSpring(0, { duration: duration * 1000, damping: 20 });
  const rounded = useTransform(count, (latest: number) => Math.floor(latest));

  useEffect(() => {
    if (inView) {
      count.set(value);
    }
  }, [inView, count, value]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest);
    });

    return unsubscribe;
  }, [rounded]);

  return (
    <span ref={ref}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};
