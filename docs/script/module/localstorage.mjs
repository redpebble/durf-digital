const jsonKeysKey = '__JSON_KEYS__';
const jsonKeys = new Set(localStorage.getItem(jsonKeysKey) ? JSON.parse(localStorage.getItem(jsonKeysKey)) : undefined);
const updateJsonKeys = () => {
    localStorage.setItem(jsonKeysKey, JSON.stringify([...jsonKeys]));
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