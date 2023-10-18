export class Store {
    db;
    name; keyPath; proto;

    constructor(name, keyPath, proto) {
        this.name = name;
        this.keyPath = keyPath;
        this.proto = proto;
    }

    init(db) {
        const store = db.createObjectStore(this.name, {
            keyPath: this.keyPath,
            autoIncrement: true,
        });

        for (let prop of Object.keys(this.proto)) {
            if (prop === this.keyPath) {
                throw new Error('Store object cannot contain a property with the same name as the keyPath');
            }
            store.createIndex(prop, prop);
        }
    }

    setDB(db) {
        this.db = db;
    }

    add(item, callback) {
        this.#transaction_readwrite((store) => store.add(item), callback);
    }

    get(id, callback) {
        const _success = callback?.success;
        callback.success = (item) => { _success?.(Object.assign(Object.create(this.proto), item)); };
        this.#transaction_readwrite((store) => store.get(id), callback);
    }

    put(key, item, callback) {
        item[this.keyPath] = key;
        this.#transaction_readwrite((store) => store.put(item), callback);
    }

    #transaction_readwrite(action, callback) {
        if (this.db === undefined) {
            callback?.error?.('DBStore not initialized');
            return;
        }

        const transaction = this.db.transaction([this.name], 'readwrite');
        const store = transaction.objectStore(this.name);

        const req = action(store);

        req.onerror = callback?.error;
        req.onsuccess = () => callback?.success?.(req.result);

        transaction.onabort = callback?.transaction?.abort;
        transaction.oncomplete = callback?.transaction?.complete;
        transaction.onerror = callback?.transaction?.error;
    }

    toString() {
        return `${this.name}`;
    }
}

export class Database {
    db;
    name; version;
    stores;

    constructor(name, version, stores) {
        this.name = name;
        this.version = version;
        this.stores = stores || [];
    }

    open(callback) {
        let req = window.indexedDB.open(this.name, this.version);

        req.onerror = callback?.error;        
        req.onblocked = callback?.blocked;
        req.onupgradeneeded = (e) => {
            // TODO // version upgrade?
            const db = e.target.result;

            this.stores.forEach(s => s.init(db));

            callback?.upgradeneeded?.();
        };
        req.onsuccess = () => {
            this.db = req.result;
            this.stores.forEach(s => s.setDB(this.db));

            callback?.success?.();
        };
    }

    getStore(storeName) {
        for (let store of this.stores) {
            if (store.name === storeName)
                return store;
        }
    }

    toString() {
        return `${this.name} v${this.version}`;
    }
}