import { useEffect, useState, type RefObject } from "react";

export function useRect<T extends HTMLElement | SVGElement>(
  ref: RefObject<T | null>,
) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateRect = () => {
      if (ref.current) {
        setRect(ref.current.getBoundingClientRect());
      } else {
        setRect(null);
      }
    };

    updateRect();

    const resizeObserver = new ResizeObserver(() => {
      updateRect();
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return rect;
}
