import type { GameElementRegistration, GameOptions } from "@/lib/game-types";
import type { MarioGame, VirtualControls } from "@/lib/mario-game";
import { createContext, useContext } from "react";

export interface GameContextType {
    isRunning: boolean;
    soundEnabled: boolean;
    musicEnabled: boolean;
    addPlayer: (playerEl: HTMLImageElement) => Promise<MarioGame | null>;
    addElement: (dom: HTMLElement | SVGElement, config: GameElementRegistration) => (() => void) | null;
    updateOptions: (options: GameOptions) => void;
    options: GameOptions;
    startGame: () => void;
    stopGame: () => void;
    toggleSound: () => void;
    toggleMusic: () => void;
    setControls: (partialControls: VirtualControls) => void;
}

export const GameContext = createContext<GameContextType | null>(null);

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
}
