import React, { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  type ValueAnimationTransition,
} from "motion/react";

import { useRect } from "@/hooks/use-rect";
import { useElasticLineEvents } from "@/hooks/use-elastic-line-events";

interface ElasticLineProps {
  isVertical?: boolean;
  grabThreshold?: number;
  releaseThreshold?: number;
  strokeWidth?: number;
  transition?: ValueAnimationTransition;
  animateInTransition?: ValueAnimationTransition;
  className?: string;
}

const ElasticLine: React.FC<ElasticLineProps> = ({
  isVertical = false,
  grabThreshold = 5,
  releaseThreshold = 100,
  strokeWidth = 1,
  transition = {
    type: "spring",
    stiffness: 400,
    damping: 5,
  },
  animateInTransition = {
    duration: 0.3,
    ease: "easeInOut",
  },
  className,
}) => {
  const containerRef = useRef<SVGSVGElement>(null);
  const dimensions = useRect(containerRef);
  const pathRef = useRef<SVGPathElement>(null);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

  // Clamp releaseThreshold to container dimensions
  const clampedReleaseThreshold = Math.min(
    releaseThreshold,
    isVertical ? (dimensions?.width ?? 0) / 2 : (dimensions?.height ?? 0) / 2,
  );

  const { isGrabbed, controlPoint } = useElasticLineEvents(
    containerRef,
    isVertical,
    grabThreshold,
    clampedReleaseThreshold,
  );

  const x = useMotionValue((dimensions?.width ?? 0) / 2);
  const y = useMotionValue((dimensions?.height ?? 0) / 2);
  const pathLength = useMotionValue(0);

  useEffect(() => {
    // Initial draw animation
    if (
      !hasAnimatedIn &&
      (dimensions?.width ?? 0) > 0 &&
      (dimensions?.height ?? 0) > 0
    ) {
      animate(pathLength, 1, {
        ...animateInTransition,
        onComplete: () => setHasAnimatedIn(true),
      });
    }
    x.set((dimensions?.width ?? 0) / 2);
    y.set((dimensions?.height ?? 0) / 2);
  }, [dimensions, hasAnimatedIn]);

  useEffect(() => {
    if (!isGrabbed && hasAnimatedIn) {
      animate(x, (dimensions?.width ?? 0) / 2, transition);
      animate(y, (dimensions?.height ?? 0) / 2, transition);
    }
  }, [isGrabbed]);

  useAnimationFrame(() => {
    if (isGrabbed) {
      x.set(controlPoint.x);
      y.set(controlPoint.y);
    }

    const controlX = hasAnimatedIn ? x.get() : (dimensions?.width ?? 0) / 2;
    const controlY = hasAnimatedIn ? y.get() : (dimensions?.height ?? 0) / 2;

    pathRef.current?.setAttribute(
      "d",
      isVertical
        ? `M${(dimensions?.width ?? 0) / 2} 0Q${controlX} ${controlY} ${
            (dimensions?.width ?? 0) / 2
          } ${dimensions?.height ?? 0}`
        : `M0 ${(dimensions?.height ?? 0) / 2}Q${controlX} ${controlY} ${
            dimensions?.width ?? 0
          } ${(dimensions?.height ?? 0) / 2}`,
    );
  });

  return (
    <svg
      ref={containerRef}
      className={`w-full h-full ${className}`}
      viewBox={`0 0 ${dimensions?.width ?? 0} ${dimensions?.height ?? 0}`}
      preserveAspectRatio="none"
    >
      <motion.path
        ref={pathRef}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        initial={{ pathLength: 0 }}
        style={{ pathLength }}
        fill="none"
      />
    </svg>
  );
};

export default ElasticLine;
