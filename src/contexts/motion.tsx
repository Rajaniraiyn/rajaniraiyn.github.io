import { LazyMotion } from 'motion/react'

const loadFeatures = () => import('@/lib/motion-features').then(mod => mod.default)

export function MotionProvider({ children }: React.PropsWithChildren) {
    return (
        <LazyMotion features={loadFeatures} strict>
            {children}
        </LazyMotion>
    )
}