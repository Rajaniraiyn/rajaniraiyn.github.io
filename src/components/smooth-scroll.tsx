import type { LenisRef } from 'lenis/react';
import { ReactLenis } from 'lenis/react';
import { cancelFrame, frame } from 'motion';
import { useInsertionEffect, useRef } from 'react';

export function SmoothScroll() {
    const lenisRef = useRef<LenisRef>(null)

    useInsertionEffect(() => {
        function update(data: { timestamp: number }) {
            const time = data.timestamp
            lenisRef.current?.lenis?.raf(time)
        }

        frame.update(update, true)

        return () => cancelFrame(update)
    }, [])


    return (
        <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
    )
}