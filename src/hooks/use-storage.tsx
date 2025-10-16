import { useCallback } from "react";
import { useSyncExternalStore } from "react";

const STORAGE_CHANGE_EVENT_KEY = "__storage-change"

export function useStorage<T>(
    key: string,
    {
        defaultValue,
        storage = localStorage,
    }: {
        defaultValue: T,
        storage?: Storage,
    }
) {
    const subscribe = useCallback((onStoreChange: () => void) => {
        const handler = (event: StorageEvent) => {
            if (event.storageArea === storage && event.key === key) {
                onStoreChange();
            }
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, [key, storage]);

    const getSnapshot = useCallback((): T => {
        const json = storage.getItem(key);
        if (json !== null) {
            try {
                return JSON.parse(json) as T;
            } catch {
                // corrupted value, ignore and fall back
            }
        }
        return defaultValue;
    }, [key, storage, defaultValue]);

    const value = useSyncExternalStore(subscribe, getSnapshot, () => defaultValue);

    const setValue = useCallback((newValue: T | ((prev: T) => T)) => {
        const valueToStore =
            typeof newValue === "function"
                ? (newValue as (prev: T) => T)(getSnapshot())
                : newValue;
        storage.setItem(key, JSON.stringify(valueToStore));
        // For our own tab:
        window.dispatchEvent(new StorageEvent(STORAGE_CHANGE_EVENT_KEY, { key, storageArea: storage }));
    }, [key, storage, getSnapshot]);

    return [value, setValue] as const;
}