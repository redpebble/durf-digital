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
                    success: (item) => console.log(item.toString())
                });
            }
        });
    }
});