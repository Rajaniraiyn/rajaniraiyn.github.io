import { useCallback } from "react";
import { useSyncExternalStore } from "react";

const STORAGE_CHANGE_EVENT = "__storage-change";

interface StorageChangeDetail {
    key: string;
    storageArea: Storage;
}

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
        const onNativeStorage = (event: StorageEvent) => {
            if (event.storageArea === storage && event.key === key) {
                onStoreChange();
            }
        };
        const onCustomStorage = (event: Event) => {
            const detail = (event as CustomEvent<StorageChangeDetail>).detail;
            if (detail.storageArea === storage && detail.key === key) {
                onStoreChange();
            }
        };
        window.addEventListener("storage", onNativeStorage);
        window.addEventListener(STORAGE_CHANGE_EVENT, onCustomStorage);
        return () => {
            window.removeEventListener("storage", onNativeStorage);
            window.removeEventListener(STORAGE_CHANGE_EVENT, onCustomStorage);
        };
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
        window.dispatchEvent(
            new CustomEvent<StorageChangeDetail>(STORAGE_CHANGE_EVENT, {
                detail: { key, storageArea: storage },
            }),
        );
    }, [key, storage, getSnapshot]);

    return [value, setValue] as const;
}
