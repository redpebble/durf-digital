class DBStore {
    db;

    name;
    key;
    autoIncrement = true;

    proto;

    constructor(name, key, proto) {
        this.name = name;
        this.key = key;
        this.proto = proto;
    }

    init(db) {
        const store = db.createObjectStore(this.name, {
            keyPath: this.key,
            autoIncrement: this.autoIncrement,
        });

        for (let prop of Object.keys(this.proto)) {
            store.createIndex(prop, prop);
        }
    }

    add(item, callback) {
        this.#transaction_readwrite((store) => store.add(item), callback);
    }

    get(id, callback) {
        const _success = callback?.success;
        callback.success = (item) => { _success?.(Object.assign(Object.create(this.proto), item)); };
        this.#transaction_readwrite((store) => store.get(id), callback);
    }

    put(id, item, callback) {
        this.#transaction_readwrite((store) => store.put(item, id), callback);
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

class Database {
    db;

    name;
    version;

    stores;

    constructor(name, version, stores) {
        this.name = name;
        this.version = version;
        this.stores = stores || [];
    }

    open(callback) {
        let req = window.indexedDB.open(this.name, this.version);

        req.onerror = callback?.error;
        req.onsuccess = () => {
            this.db = req.result;
            for (let store of this.stores) {
                store.db = this.db;
            }

            callback?.success?.();
        };
        
        req.onblocked = callback?.blocked;
        req.onupgradeneeded = (e) => {
            // TODO // version upgrade?
            const db = e.target.result;

            for (let store of this.stores) {
                store.init(db);
            }

            callback?.upgradeneeded?.();
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