export enum StorageKeys {
    AccessToken = 'access_token',
}

export const StorageWrapper = {
    get<T>(key: StorageKeys, defaultValue: T | null = null): T | null {
        if (process.client) {
            try {
                const item = localStorage.getItem(key);
                if (item === null) {
                    return defaultValue;
                }
                return JSON.parse(item) as T;
            } catch {
                return defaultValue;
            }
        }
        return defaultValue;
    },

    set<T>(key: StorageKeys, value: T): void {
        if (process.client) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },

    remove(key: StorageKeys): void {
        if (process.client) {
            localStorage.removeItem(key);
        }
    },

    has(key: StorageKeys): boolean {
        if (process.client) {
            return localStorage.getItem(key) !== null;
        }
        return false;
    },

    clear(): void {
        if (process.client) {
            localStorage.clear();
        }
    }
};
