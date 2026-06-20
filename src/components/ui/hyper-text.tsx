import { AnimatePresence, type MotionProps } from "motion/react"
import * as m from "motion/react-m"
import {
  useDeferredValue,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useInsertionEffect,
  useId,
} from "react"

import { cn } from "@/lib/utils"

type CharacterSet = string[] | readonly string[]

type HyperTextAs = "div" | "h3"

type HyperTextBaseProps = Omit<MotionProps, "children"> & {
  /** The text content to be animated */
  children: string
  /** Optional className for styling */
  className?: string
  /** Duration of the animation in milliseconds */
  duration?: number
  /** Delay before animation starts in milliseconds */
  delay?: number
  /** Whether to start animation when element comes into view */
  startOnView?: boolean
  /** Whether to trigger animation on hover */
  animateOnHover?: boolean
  /** Custom character set for scramble effect. Defaults to uppercase alphabet */
  characterSet?: CharacterSet
}

type HyperTextProps<T extends HyperTextAs = "div"> = HyperTextBaseProps &
  Omit<React.ComponentPropsWithoutRef<T>, "children"> & {
    /** Supported host elements — defaults to div */
    as?: T
  }

const DEFAULT_CHARACTER_SET = Object.freeze(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
) as readonly string[]

const getRandomInt = (max: number): number => Math.floor(Math.random() * max)

const MotionDiv = m.create("div", {
  forwardMotionProps: true,
})

const MotionH3 = m.create("h3", {
  forwardMotionProps: true,
})

export function HyperText<T extends HyperTextAs = "div">({
  children,
  className,
  duration = 800,
  delay = 0,
  as: Component = "div" as T,
  startOnView = false,
  animateOnHover = true,
  characterSet = DEFAULT_CHARACTER_SET,
  ...props
}: HyperTextProps<T>) {
  const deferredChildren = useDeferredValue(children)
  const lettersFromChildren = useMemo(
    () => deferredChildren.split(""),
    [deferredChildren],
  )

  const [scrambleText, setScrambleText] = useState<string[] | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const iterationCount = useRef(0)
  const elementRef = useRef<HTMLDivElement | HTMLHeadingElement>(null)

  const displayText = isAnimating && scrambleText !== null
    ? scrambleText
    : lettersFromChildren

  const handleAnimationTrigger = () => {
    if (animateOnHover && !isAnimating) {
      iterationCount.current = 0
      setScrambleText(lettersFromChildren)
      setIsAnimating(true)
    }
  }

  useLayoutEffect(() => {
    if (!isAnimating) return

    const maxIterations = deferredChildren.length
    const startTime = performance.now()
    let animationFrameId: number

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const itCount = Math.floor(progress * maxIterations)
      iterationCount.current = itCount

      setScrambleText((currentText) =>
        (currentText ?? lettersFromChildren).map((_, index) =>
          deferredChildren[index] === " "
            ? " "
            : index <= itCount
              ? deferredChildren[index]
              : characterSet[getRandomInt(characterSet.length)]
        )
      )

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
        setScrambleText(null)
      }
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [deferredChildren, duration, isAnimating, characterSet, lettersFromChildren])

  useInsertionEffect(() => {
    if (!startOnView || !elementRef.current) return

    let started = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true
          setTimeout(() => {
            setScrambleText(deferredChildren.split(""))
            setIsAnimating(true)
          }, delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "-30% 0px -30% 0px" }
    )
    observer.observe(elementRef.current)
    return () => observer.disconnect()
  }, [delay, startOnView, deferredChildren])

  useLayoutEffect(() => {
    if (!startOnView) {
      const startTimeout = setTimeout(() => {
        setScrambleText(deferredChildren.split(""))
        setIsAnimating(true)
      }, delay)
      return () => clearTimeout(startTimeout)
    }
  }, [delay, startOnView, deferredChildren])

  const srId = useId()

  const motionProps = {
    "aria-labelledby": srId,
    className: cn("overflow-hidden py-2 text-4xl font-bold", className),
    onMouseEnter: handleAnimationTrigger,
    ...props,
  }

  const content = (
    <>
      <AnimatePresence>
        {displayText.map((letter, index) => (
          <m.span
            key={index}
            className={letter === " " ? "w-3" : ""}
          >
            {letter.toUpperCase()}
          </m.span>
        ))}
      </AnimatePresence>
      <span id={srId} className="sr-only">{deferredChildren}</span>
    </>
  )

  if (Component === "h3") {
    return (
      <MotionH3 ref={elementRef} {...motionProps}>
        {content}
      </MotionH3>
    )
  }

  return (
    <MotionDiv ref={elementRef} {...motionProps}>
      {content}
    </MotionDiv>
  )
}
