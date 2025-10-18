import { MarioGame, type GameElement, type GameElementRegistration } from "@/lib/mario-game"
import { createContext, useCallback, useContext, useRef } from "react"

export interface GameContextType {
    game: MarioGame | null;
    addPlayer: (playerEl: HTMLImageElement) => MarioGame;
    addElement: (dom: HTMLElement, config: GameElementRegistration) => (() => void) | null;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const gameRef = useRef<MarioGame | null>(null);
    const registeredElements = useRef(
        new Map<HTMLElement, { options: GameElementRegistration; detach: (() => void) | null }>(),
    );

    const attachRegisteredElements = useCallback(() => {
        const game = gameRef.current;
        if (!game) return;

        for (const [dom, entry] of registeredElements.current.entries()) {
            entry.detach?.();
            const disposer = game.addElement(dom, entry.options);
            entry.detach = () => {
                disposer?.();
                entry.detach = null;
            };
        }
    }, []);

    const addPlayer = useCallback((playerEl: HTMLImageElement) => {
        gameRef.current?.dispose();

        const newGame = new MarioGame(playerEl);
        gameRef.current = newGame;
        attachRegisteredElements();

        return newGame;
    }, [attachRegisteredElements]);

    const addElement = useCallback((dom: HTMLElement, config: GameElementRegistration) => {
        const normalizedConfig: GameElementRegistration = {
            ...config,
            collisionSides: config.collisionSides ? { ...config.collisionSides } : undefined,
            passThrough: config.passThrough ? { ...config.passThrough } : undefined,
            metadata: config.metadata ? { ...config.metadata } : undefined,
        };

        const existing = registeredElements.current.get(dom);
        if (existing) {
            existing.detach?.();
            existing.options = normalizedConfig;
        } else {
            registeredElements.current.set(dom, { options: normalizedConfig, detach: null });
        }

        const entry = registeredElements.current.get(dom);
        if (!entry) return null;

        const attachToGame = () => {
            const game = gameRef.current;
            if (!game) return;
            entry.detach?.();
            const disposer = game.addElement(dom, entry.options);
            entry.detach = () => {
                disposer?.();
                entry.detach = null;
            };
        };

        attachToGame();

        const cleanup = () => {
            const record = registeredElements.current.get(dom);
            if (!record) return;
            record.detach?.();
            registeredElements.current.delete(dom);
        };

        return cleanup;
    }, []);

    const game = gameRef.current;

    return (
        <GameContext.Provider value={{ game, addPlayer, addElement }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
}
