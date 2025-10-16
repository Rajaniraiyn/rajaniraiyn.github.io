import { AnimatePresence, type MotionProps } from "motion/react"
import * as m from "motion/react-m"
import {
  useDeferredValue,
  useLayoutEffect,
  useRef,
  useState,
  useInsertionEffect,
  useId,
} from "react"

import { cn } from "@/lib/utils"

type CharacterSet = string[] | readonly string[]

type HyperTextProps<T extends React.ElementType> = Omit<MotionProps, "children"> & React.ComponentPropsWithoutRef<T> & {
  /** The text content to be animated */
  children: string
  /** Optional className for styling */
  className?: string
  /** Duration of the animation in milliseconds */
  duration?: number
  /** Delay before animation starts in milliseconds */
  delay?: number
  /** Component to render as - defaults to div */
  as?: T
  /** Whether to start animation when element comes into view */
  startOnView?: boolean
  /** Whether to trigger animation on hover */
  animateOnHover?: boolean
  /** Custom character set for scramble effect. Defaults to uppercase alphabet */
  characterSet?: CharacterSet
}

const DEFAULT_CHARACTER_SET = Object.freeze(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
) as readonly string[]

const getRandomInt = (max: number): number => Math.floor(Math.random() * max)

export function HyperText<T extends React.ElementType = "div">({
  children,
  className,
  duration = 800,
  delay = 0,
  as: Component = 'div' as T,
  startOnView = false,
  animateOnHover = true,
  characterSet = DEFAULT_CHARACTER_SET,
  ...props
}: HyperTextProps<T>) {
  const MotionComponent = m.create(Component, {
    forwardMotionProps: true,
  })

  const deferredChildren = useDeferredValue(children)

  const [displayText, setDisplayText] = useState<string[]>(() =>
    deferredChildren.split("")
  )
  const [isAnimating, setIsAnimating] = useState(false)
  const iterationCount = useRef(0)
  const elementRef = useRef<HTMLElement>(null)

  const handleAnimationTrigger = () => {
    if (animateOnHover && !isAnimating) {
      iterationCount.current = 0
      setIsAnimating(true)
    }
  }

  useLayoutEffect(() => {
    if (!isAnimating) return

    const maxIterations = deferredChildren.length
    const startTime = performance.now()
    let animationFrameId: number

    // Use local array to avoid state batching issues.
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const itCount = Math.floor(progress * maxIterations)
      iterationCount.current = itCount

      // Use direct calculation for optimal update.
      setDisplayText((currentText) =>
        currentText.map((_, index) =>
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
      }
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [deferredChildren, duration, isAnimating, characterSet])

  useInsertionEffect(() => {
    if (!startOnView || !elementRef.current) return

    let started = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true
          setTimeout(() => setIsAnimating(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "-30% 0px -30% 0px" }
    )
    observer.observe(elementRef.current)
    return () => observer.disconnect()
  }, [delay, startOnView])

  useLayoutEffect(() => {
    if (!startOnView) {
      const startTimeout = setTimeout(() => {
        setIsAnimating(true)
      }, delay)
      return () => clearTimeout(startTimeout)
    }
  }, [delay, startOnView])

  useLayoutEffect(() => {
    setDisplayText(deferredChildren.split(""))
  }, [deferredChildren])

  const srId = useId()

  return (
    <MotionComponent
      ref={elementRef}
      aria-labelledby={srId}
      className={cn("overflow-hidden py-2 text-4xl font-bold", className)}
      onMouseEnter={handleAnimationTrigger}
      {...props}
    >
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
    </MotionComponent>
  )
}
