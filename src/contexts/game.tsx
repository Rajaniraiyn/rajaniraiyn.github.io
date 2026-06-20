import type { GameSoundHandler } from "@/lib/game-types";
import type { GameElementRegistration, GameOptions } from "@/lib/game-types";
import type { MarioGame, VirtualControls } from "@/lib/mario-game";
import { GameContext, type GameContextType } from "@/contexts/use-game";
import { useCallback, useEffect, useRef, useState } from "react";

// No-op sound handler for when sound is disabled
const NOOP_SOUND: GameSoundHandler = () => { };

type CreateGameSoundHandler = typeof import("@/lib/mario-game").createGameSoundHandler;

export function GameProvider({ children, options }: { children: React.ReactNode; options?: GameOptions }) {
    const gameRef = useRef<MarioGame | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [musicEnabled, setMusicEnabled] = useState(true);
    const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
    const pendingStartRef = useRef(false);
    const loadGenerationRef = useRef(0);
    const registeredElements = useRef(
        new Map<HTMLElement | SVGElement, { options: GameElementRegistration; detach: (() => void) | null }>(),
    );
    const defaultSoundHandlerRef = useRef<GameSoundHandler | null>(null);
    const optionsRef = useRef<GameOptions>(options ?? {});
    const [currentOptions, setCurrentOptions] = useState<GameOptions>(() => options ?? {});
    const soundEnabledRef = useRef(soundEnabled);
    const musicEnabledRef = useRef(musicEnabled);

    useEffect(() => {
        soundEnabledRef.current = soundEnabled;
    }, [soundEnabled]);

    useEffect(() => {
        musicEnabledRef.current = musicEnabled;
    }, [musicEnabled]);

    const invalidatePendingLoads = useCallback(() => {
        loadGenerationRef.current += 1;
        pendingStartRef.current = false;
    }, []);

    const ensureBackgroundMusic = useCallback(async () => {
        if (!backgroundMusicRef.current) {
            const { default: backgroundMusicSrc } = await import("@/assets/audio/8-bit-background.mp3");
            backgroundMusicRef.current = new Audio(backgroundMusicSrc);
            backgroundMusicRef.current.loop = true;
            backgroundMusicRef.current.volume = 0.3;
        }

        return backgroundMusicRef.current;
    }, []);

    const playBackgroundMusic = useCallback(async () => {
        const audio = await ensureBackgroundMusic();
        audio.play().catch(() => {
            // Ignore play errors (user interaction required)
        });
    }, [ensureBackgroundMusic]);

    const pauseBackgroundMusic = useCallback(() => {
        if (!backgroundMusicRef.current) return;
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
    }, []);

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

    const startGameInternal = useCallback(async () => {
        if (!gameRef.current) return;

        gameRef.current.start();
        setIsRunning(true);

        if (musicEnabledRef.current) {
            await playBackgroundMusic();
        }
    }, [playBackgroundMusic]);

    const addPlayer = useCallback(async (playerEl: HTMLImageElement) => {
        const generation = loadGenerationRef.current + 1;
        loadGenerationRef.current = generation;

        gameRef.current?.dispose();
        gameRef.current = null;
        setIsRunning(false);

        const [{ MarioGame, createGameSoundHandler }, soundscapeModule] = await Promise.all([
            import("@/lib/mario-game"),
            soundEnabledRef.current ? import("@/lib/mario-soundscape") : Promise.resolve(null),
        ]);

        if (generation !== loadGenerationRef.current) {
            return null;
        }

        if (soundEnabledRef.current && soundscapeModule && !defaultSoundHandlerRef.current) {
            defaultSoundHandlerRef.current = soundscapeModule.createDefaultMarioSoundHandler();
        }

        const normalized = normalizeGameOptions(
            optionsRef.current,
            soundEnabledRef.current ? defaultSoundHandlerRef.current ?? undefined : undefined,
            createGameSoundHandler,
        );
        optionsRef.current = normalized;
        setCurrentOptions(normalized);

        const newGame = new MarioGame(playerEl, optionsRef.current);

        if (generation !== loadGenerationRef.current) {
            newGame.dispose();
            return null;
        }

        gameRef.current = newGame;
        attachRegisteredElements();

        if (pendingStartRef.current && generation === loadGenerationRef.current) {
            pendingStartRef.current = false;
            await startGameInternal();
        }

        return newGame;
    }, [attachRegisteredElements, startGameInternal]);

    const addElement = useCallback((dom: HTMLElement | SVGElement, config: GameElementRegistration) => {
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

    const applyOptions = useCallback(async (next: GameOptions) => {
        if (!next) return;

        const needsEngine = Boolean(next.soundMap && !next.onSound);
        let createGameSoundHandler: CreateGameSoundHandler | undefined;

        if (needsEngine) {
            ({ createGameSoundHandler } = await import("@/lib/mario-game"));
        }

        const normalized = normalizeGameOptions(
            next,
            soundEnabled ? defaultSoundHandlerRef.current ?? undefined : undefined,
            createGameSoundHandler,
        );
        optionsRef.current = { ...optionsRef.current, ...normalized };
        setCurrentOptions(optionsRef.current);
        gameRef.current?.updateOptions(optionsRef.current);
    }, [soundEnabled]);

    useEffect(() => {
        if (options) {
            void applyOptions(options);
        }
    }, [options, applyOptions]);

    const startGame = useCallback(() => {
        if (!gameRef.current) {
            pendingStartRef.current = true;
            return;
        }

        void startGameInternal();
    }, [startGameInternal]);

    const stopGame = useCallback(() => {
        invalidatePendingLoads();

        if (gameRef.current) {
            gameRef.current.dispose();
            gameRef.current = null;
        }
        setIsRunning(false);
        pauseBackgroundMusic();
    }, [invalidatePendingLoads, pauseBackgroundMusic]);

    const toggleSound = useCallback(() => {
        setSoundEnabled(prev => {
            const newValue = !prev;

            if (gameRef.current) {
                void (async () => {
                    let handler: GameSoundHandler = NOOP_SOUND;

                    if (newValue) {
                        if (!defaultSoundHandlerRef.current) {
                            const { createDefaultMarioSoundHandler } = await import("@/lib/mario-soundscape");
                            defaultSoundHandlerRef.current = createDefaultMarioSoundHandler();
                        }
                        handler = defaultSoundHandlerRef.current;
                    }

                    const newOptions = {
                        ...optionsRef.current,
                        onSound: newValue ? handler : NOOP_SOUND,
                    };
                    optionsRef.current = newOptions;
                    gameRef.current?.updateOptions(newOptions);
                })();
            }

            return newValue;
        });
    }, []);

    const toggleMusic = useCallback(() => {
        setMusicEnabled(prev => {
            const newValue = !prev;

            if (newValue && isRunning) {
                void playBackgroundMusic();
            } else if (!newValue && backgroundMusicRef.current) {
                backgroundMusicRef.current.pause();
            }

            return newValue;
        });
    }, [isRunning, playBackgroundMusic]);

    const setControls = useCallback((partialControls: VirtualControls) => {
        gameRef.current?.setVirtualControls(partialControls);
    }, []);

    useEffect(() => {
        return () => {
            invalidatePendingLoads();

            if (gameRef.current) {
                gameRef.current.dispose();
                gameRef.current = null;
            }

            if (backgroundMusicRef.current) {
                backgroundMusicRef.current.pause();
                backgroundMusicRef.current = null;
            }
        };
    }, [invalidatePendingLoads]);

    const updateOptions = applyOptions;

    const value: GameContextType = {
        isRunning,
        soundEnabled,
        musicEnabled,
        addPlayer,
        addElement,
        updateOptions,
        options: currentOptions,
        startGame,
        stopGame,
        toggleSound,
        toggleMusic,
        setControls,
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}

function normalizeGameOptions(
    options: GameOptions,
    defaultHandler?: GameSoundHandler,
    createGameSoundHandler?: CreateGameSoundHandler,
): GameOptions {
    const normalized: GameOptions = { ...options };

    if (normalized.soundMap && !normalized.onSound && createGameSoundHandler) {
        normalized.onSound = createGameSoundHandler(normalized.soundMap);
    }

    if (!normalized.onSound && defaultHandler) {
        normalized.onSound = defaultHandler;
    }

    return normalized;
}
