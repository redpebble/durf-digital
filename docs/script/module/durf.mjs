export class Item {
    name;
    description;

    constructor(obj) {
        Object.assign(this, obj);
    }

    toString() {
        return `${this.name}`;
    }
}

export class Inventory {
    slots;
    gold;
    items;

    constructor(obj) {
        Object.assign(this, obj);
    }
}

export class Character {
    name;
    str; dex; wil;
    hd; wounds;
    armor; armorMax;
    xp;
    inventory;
    notes; spells;

    constructor(obj) {
        Object.assign(this, obj);
    }
}