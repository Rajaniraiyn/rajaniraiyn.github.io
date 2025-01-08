import { cn } from "@/lib/utils";
import { motion, useAnimation } from "motion/react";
import { useEffect, type FC, type HTMLAttributes, type SVGProps } from "react";

interface Props {
  animate?: boolean;
  duration?: number;
  svgProps?: SVGProps<SVGSVGElement>;
}

const AudioLinesIcon: FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  animate = false,
  duration = 1,
  className,
  svgProps,
  ...props
}) => {
  const controls = useAnimation();

  useEffect(() => {
    if (animate) {
      controls.start("animate");
    } else {
      controls.start("normal");
    }
  }, [animate, controls]);

  return (
    <div
      className={cn(
        "cursor-pointer select-none p-2 rounded-md transition-colors duration-200 flex items-center justify-center",
        className,
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...svgProps}
      >
        <path d="M2 10v3" />
        <motion.path
          variants={{
            normal: { d: "M6 6v11" },
            animate: {
              d: ["M6 6v11", "M6 10v3", "M6 6v11"],
              transition: {
                duration: 1.5 * duration,
                repeat: Infinity,
              },
            },
          }}
          d="M6 6v11"
          animate={controls}
        />
        <motion.path
          variants={{
            normal: { d: "M10 3v18" },
            animate: {
              d: ["M10 3v18", "M10 9v5", "M10 3v18"],
              transition: {
                duration: 1 * duration,
                repeat: Infinity,
              },
            },
          }}
          d="M10 3v18"
          animate={controls}
        />
        <motion.path
          variants={{
            normal: { d: "M14 8v7" },
            animate: {
              d: ["M14 8v7", "M14 6v11", "M14 8v7"],
              transition: {
                duration: 0.8 * duration,
                repeat: Infinity,
              },
            },
          }}
          d="M14 8v7"
          animate={controls}
        />
        <motion.path
          variants={{
            normal: { d: "M18 5v13" },
            animate: {
              d: ["M18 5v13", "M18 7v9", "M18 5v13"],
              transition: {
                duration: 1.5 * duration,
                repeat: Infinity,
              },
            },
          }}
          d="M18 5v13"
          animate={controls}
        />
        <path d="M22 10v3" />
      </svg>
    </div>
  );
};

export { AudioLinesIcon };
