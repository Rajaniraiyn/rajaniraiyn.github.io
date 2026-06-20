import { useCallback, useEffect, useMemo, useRef } from "react"

import { useGame } from "@/contexts/use-game"
import type { GameElementRegistration } from "@/lib/game-types"

function normalizeConfig(config: Omit<GameElementRegistration, 'events'>): Omit<GameElementRegistration, 'events'> {
    return {
        ...config,
        collisionSides: config.collisionSides ? { ...config.collisionSides } : undefined,
        passThrough: config.passThrough ? { ...config.passThrough } : undefined,
        metadata: config.metadata ? { ...config.metadata } : undefined,
    }
}

export function useGameElement<T extends HTMLElement | SVGElement>(
    config: GameElementRegistration,
) {
    const { addElement } = useGame()
    const cleanupRef = useRef<(() => void) | null>(null)

    // Extract events from config to avoid including them in deps unnecessarily
    const { events, ...configWithoutEvents } = config
    const normalizedConfig = useMemo(
        () => normalizeConfig(configWithoutEvents),
        // Normalize once on mount; call sites pass stable inline config objects.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    // Combine normalized config with events
    const finalConfig = useMemo(() => ({
        ...normalizedConfig,
        events,
    }), [normalizedConfig, events])

    const register = useCallback(
        (node: T | null) => {
            if (cleanupRef.current) {
                cleanupRef.current()
                cleanupRef.current = null
            }

            if (node) {
                cleanupRef.current = addElement(node, finalConfig) ?? null
            }
        },
        [addElement, finalConfig],
    )

    useEffect(
        () => () => {
            cleanupRef.current?.()
            cleanupRef.current = null
        },
        [],
    )

    return register
}
