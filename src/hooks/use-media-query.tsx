import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
    return useSyncExternalStore(
        (onStoreChange) => {
            const media = window.matchMedia(query);

            // Initial subscription
            media.addEventListener("change", onStoreChange);

            // Cleanup
            return () => media.removeEventListener("change", onStoreChange);
        },
        () => window.matchMedia(query).matches,
        () => false // server: always return false
    );
}