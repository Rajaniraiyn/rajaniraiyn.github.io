import { useMotionValue } from "motion/react";
import { useEffect, useRef, useState, type RefObject } from "react";

function useMouseEvents(
  containerRef: RefObject<HTMLElement | SVGElement | null> | undefined,
  onMove: (x: number, y: number, rect: DOMRect) => void,
) {
  useEffect(() => {
    const element = containerRef?.current ?? document.documentElement;

    const handlePosition = (x: number, y: number) => {
      const rect = element.getBoundingClientRect();
      onMove(x, y, rect);
    };

    const handleMouseMove = (ev: Event) => {
      if (ev instanceof MouseEvent) handlePosition(ev.clientX, ev.clientY);
    };
    const handleTouchMove = (ev: Event) => {
      if (ev instanceof TouchEvent) {
        const [touch] = ev.touches;
        handlePosition(touch.clientX, touch.clientY);
      }
    };

    element.addEventListener("mousemove", handleMouseMove, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("touchmove", handleTouchMove);
    };
  }, [containerRef, onMove]);
}

export function useMouseState(
  containerRef?: RefObject<HTMLElement | SVGElement | null>,
) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useMouseEvents(containerRef, (x, y, rect) => {
    setPosition({ x: x - rect.left, y: y - rect.top });
  });
  return position;
}

export function useMouseMotionValue(
  containerRef?: RefObject<HTMLElement | SVGElement | null>,
) {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  useMouseEvents(containerRef, (x, y, rect) => {
    cursorX.set(x - rect.left);
    cursorY.set(y - rect.top);
  });
  return { cursorX, cursorY };
}

export function useMouseRef(
  containerRef?: RefObject<HTMLElement | SVGElement | null>,
) {
  const positionRef = useRef({ x: 0, y: 0 });
  useMouseEvents(containerRef, (x, y, rect) => {
    positionRef.current = { x: x - rect.left, y: y - rect.top };
  });
  return positionRef;
}
