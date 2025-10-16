import { cn } from "@/lib/utils";
import { useInView, type MotionProps } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";

const TOTAL_DURATION = 5;

const PATHS = [
    {
        d: "M87 385c2 68 48 294 60 328 0 0-3-78-48-159-62-113-73-128-73-128-3-5-13-18-17-38-11-36 7-84 53-99 15-9 70-18 95 2 63 63-90 297 29 333 50 10 75-37 67-75-13-44-3-87 12-105 16-20 34-25 44 0 3 6 9 22 6 23-3 2-9-40-23-40-15 0-39 40-42 51-4 16-9 72 15 91 53 38 39-77 47-82 3 0 3 14 13 18 7 3 17 0 22-6 7-7 6-18 4-32-2-15-9-63-12-62-8-5 42 271 59 297 6-7-24-167-32-259 0-2 7 2 12 6 7 5 7 7 10 7 7 0 7-16 16-19 5-2 10 1 21 6s14 9 17 7c4-2 0-12 6-17 3-3 7-2 13-3 0 0 8-1 24-7 37-13 48-68 39-89 7 55 19 252 47 299 5 0-1-37-3-64-5-38-29-172-12-175 3-1 5 7 11 7s9-8 21-24c20-27 19-5 38-4 5-1 5-4 14-10l18-9c27-14 38-44 39-63",
        length: 3639,
        duration: TOTAL_DURATION * 3.639 / 8.5,
        delay: 0
    },
    {
        d: "M731 84c16 94 44 199 78 276 1 0-11-62-55-119-31-39-56-60-69-136-7-42 0-88 61-99 79 2 79 90 60 128-14 34-41 67-24 106 3 7 10 16 38 29 60 32 84 21 71-31",
        length: 1158,
        duration: TOTAL_DURATION * 1.158 / 8.5,
        delay: TOTAL_DURATION * 3.7 / 8.5
    },
    {
        d: "m339 350-5 15",
        length: 16,
        duration: TOTAL_DURATION * 0.16 / 8.5,
        delay: TOTAL_DURATION * 4.8 / 8.5
    },
    {
        d: "m525 297-12-8",
        length: 16,
        duration: TOTAL_DURATION * 0.16 / 8.5,
        delay: TOTAL_DURATION * 4.9 / 8.5
    }
];

type SignatureProps = Omit<React.ComponentProps<'svg'> & MotionProps, 'children'> & {
    animateOnlyWhenVisible?: boolean;
};

export function Signature({ className, animateOnlyWhenVisible = true, ...props }: SignatureProps) {
    const ref = useRef<SVGSVGElement>(null);

    const isInView = useInView(ref);
    return (
        <svg
            ref={ref}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 900 719"
            className={cn("stroke-current stroke-12 fill-none w-full h-auto", className)}
            {...props}
        >
            {(animateOnlyWhenVisible && isInView) && (
                PATHS.map((path, i) => (
                    <m.path
                        key={i}
                        d={path.d}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={path.length}
                        initial={{
                            strokeDashoffset: path.length
                        }}
                        animate={{
                            strokeDashoffset: 0
                        }}
                        transition={{
                            delay: path.delay,
                            duration: path.duration,
                            ease: "linear",
                        }}
                    />
                ))
            )}
        </svg>
    );
}