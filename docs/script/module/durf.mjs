export class Item {
    name = '';
    description = '';

    constructor(obj) {
        Object.assign(this, obj);
    }

    toString() {
        return `[item "${this.name}"]`;
    }
}

export class Character {
    name = '';
    str = '';
    dex = '';
    wil = '';
    hd = '';
    wounds = '';
    armor = '';
    armorMax = '';
    xp = '';
    numSlots = '';
    gold = '';
    slots = [];
    notes = '';
    spells = '';

    constructor(obj) {
        Object.assign(this, obj);
    }

    toString() {
        return `[character "${this.name}"]`;
    }
}