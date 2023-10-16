class DURFItem {
    name;
    description;

    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    toString() {
        return `${this.name}`;
    }
}

class DURFInventory {
    slots;
    gold;
    items;
}

class DURFCharacter {
    name;
    str; dex; wil;
    hd; wounds;
    armor; armorMax;
    xp;
    inventory;
    notes; spells;
}

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

const DB = new Database('durf_db', 1, [
    new DBStore('characters', 'id', new DURFCharacter()),
    new DBStore('items', 'id', new DURFItem()),
]);

DB.open({
    error: () => { console.error(`Database failed to open`); },
    upgradeneeded: () => { console.info(`Database upgrade needed`); },
    success: () => {
        console.info(`Database opened`);

        const item = new DURFItem(
            'Rucksack of Retaining', 
            'A mysterious travel pack containing a rift in the very essence of spacetime. Convenient for storing stuff! Has 5 magical storage slots.');
        
        DB.getStore('items')?.add(item, {
            success: (id) => {
                console.log(id);
                DB.getStore('items')?.get(id, {
                    success: (item) => console.log(Object.assign(new DURFItem(), item).toString())
                })
            }
        });
    }
});