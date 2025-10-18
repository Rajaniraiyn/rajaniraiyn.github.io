import { useCallback, useEffect, useMemo, useRef } from "react"
import type { DependencyList } from "react"

import { useGame } from "@/contexts/game"
import type { GameElementRegistration } from "@/lib/mario-game"

function normalizeConfig(config: GameElementRegistration): GameElementRegistration {
    return {
        ...config,
        collisionSides: config.collisionSides ? { ...config.collisionSides } : undefined,
        passThrough: config.passThrough ? { ...config.passThrough } : undefined,
        metadata: config.metadata ? { ...config.metadata } : undefined,
    }
}

export function useGameElement<T extends HTMLElement>(
    config: GameElementRegistration,
    deps: DependencyList = [],
) {
    const { addElement } = useGame()
    const cleanupRef = useRef<(() => void) | null>(null)

    const normalizedConfig = useMemo(() => normalizeConfig(config), deps)

    const register = useCallback(
        (node: T | null) => {
            if (cleanupRef.current) {
                cleanupRef.current()
                cleanupRef.current = null
            }

            if (node) {
                cleanupRef.current = addElement(node, normalizedConfig) ?? null
            }
        },
        [addElement, normalizedConfig],
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
