const KEY_JSONKEYS = '__JSON_KEYS__';
const jsonKeys = (() => {
    const jsonKeysStr = localStorage.getItem(KEY_JSONKEYS);
    return new Set(jsonKeysStr ? JSON.parse(jsonKeysStr) : undefined);
})();
const updateJsonKeys = () => {
    localStorage.setItem(KEY_JSONKEYS, JSON.stringify([...jsonKeys]));
}

let classMap = {};
export const setClassMap = (map) => {
    classMap = map;
}

export const setItem = (key, item) => {
    if (typeof item === 'object') {
        item = JSON.stringify(item);
        jsonKeys.add(key);
        updateJsonKeys();
    }
    localStorage.setItem(key, item);
}

export const getItem = (key) => {
    let item = localStorage.getItem(key);
    if (item && jsonKeys.has(key)) {
        item = JSON.parse(item);
        const objClass = classMap?.[key];
        if (objClass) {
            return Object.assign(new objClass(), item);
        }
        return item;
    }
    return item;
}

export const removeItem = (key) => {
    localStorage.removeItem(key);
    jsonKeys.delete(key);
    updateJsonKeys();
}

export const clear = () => {
    localStorage.clear();
    jsonKeys.clear();
}

export const length = () => localStorage.length;
export const key = (i) => localStorage.key(i);