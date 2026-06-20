import gameTowerUrl from "@/assets/wallpapers/game-tower.jpeg?url";
import { useStorage } from "@/hooks/use-storage";

export const GAME_PROGRESS_STORAGE_KEY = "game-progress";

export const SUMMIT_REWARD_WALLPAPER = gameTowerUrl;

export const GAME_SUMMIT_REACHED_EVENT = "game-summit-reached";
export const GAME_SUMMIT_LEAVE_EVENT = "game-summit-leave";

export function dispatchSummitReached() {
    window.dispatchEvent(new CustomEvent(GAME_SUMMIT_REACHED_EVENT));
}

export function dispatchSummitLeave() {
    window.dispatchEvent(new CustomEvent(GAME_SUMMIT_LEAVE_EVENT));
}

export function useGameProgress() {
    return useStorage<boolean>(GAME_PROGRESS_STORAGE_KEY, { defaultValue: false });
}
