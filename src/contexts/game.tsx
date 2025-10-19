import { MarioGame, createGameSoundHandler, type GameElementRegistration, type GameOptions, type GameSoundHandler } from "@/lib/mario-game";
import { createDefaultMarioSoundHandler } from "@/lib/mario-soundscape";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// No-op sound handler for when sound is disabled
const NOOP_SOUND: GameSoundHandler = () => { };

export interface GameContextType {
    game: MarioGame | null;
    isRunning: boolean;
    soundEnabled: boolean;
    addPlayer: (playerEl: HTMLImageElement) => MarioGame;
    addElement: (dom: HTMLElement, config: GameElementRegistration) => (() => void) | null;
    updateOptions: (options: GameOptions) => void;
    options: GameOptions;
    startGame: () => void;
    stopGame: () => void;
    toggleSound: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children, options }: { children: React.ReactNode; options?: GameOptions }) {
    const gameRef = useRef<MarioGame | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const registeredElements = useRef(
        new Map<HTMLElement, { options: GameElementRegistration; detach: (() => void) | null }>(),
    );
    const defaultSoundHandlerRef = useRef(createDefaultMarioSoundHandler());
    const optionsRef = useRef<GameOptions>(normalizeGameOptions(options ?? {}, defaultSoundHandlerRef.current));
    const [currentOptions, setCurrentOptions] = useState<GameOptions>(optionsRef.current);

    const applyOptions = useCallback((next: GameOptions) => {
        if (!next) return;
        const normalized = normalizeGameOptions(next, soundEnabled ? defaultSoundHandlerRef.current : undefined);
        optionsRef.current = { ...optionsRef.current, ...normalized };
        setCurrentOptions(optionsRef.current);
        gameRef.current?.updateOptions(optionsRef.current);
    }, [soundEnabled]);

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
        setIsRunning(false);

        const newGame = new MarioGame(playerEl, optionsRef.current);
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
            events: config.events ? { ...config.events } : undefined,
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

    useEffect(() => {
        if (options) {
            applyOptions(options);
        }
    }, [options, applyOptions]);

    const startGame = useCallback(() => {
        if (!gameRef.current) return;
        gameRef.current.start();
        setIsRunning(true);
    }, []);

    const stopGame = useCallback(() => {
        if (gameRef.current) {
            gameRef.current.dispose();
            gameRef.current = null;
        }
        setIsRunning(false);
    }, []);

    const toggleSound = useCallback(() => {
        setSoundEnabled(prev => {
            const newValue = !prev;
            // Update game options if game is running
            if (gameRef.current) {
                const newOptions = {
                    ...optionsRef.current,
                    onSound: newValue ? defaultSoundHandlerRef.current : NOOP_SOUND
                };
                optionsRef.current = newOptions;
                gameRef.current.updateOptions(newOptions);
            }
            return newValue;
        });
    }, []);

    const updateOptions = applyOptions;
    const game = gameRef.current;

    return (
        <GameContext.Provider value={{ game, isRunning, soundEnabled, addPlayer, addElement, updateOptions, options: currentOptions, startGame, stopGame, toggleSound }}>
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

function normalizeGameOptions(options: GameOptions, defaultHandler?: GameSoundHandler): GameOptions {
    const normalized: GameOptions = { ...options };

    if (normalized.soundMap && !normalized.onSound) {
        normalized.onSound = createGameSoundHandler(normalized.soundMap);
    }

    if (!normalized.onSound && defaultHandler) {
        normalized.onSound = defaultHandler;
    }

    return normalized;
}
