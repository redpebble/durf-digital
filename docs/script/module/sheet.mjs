import * as DURF from './durf.mjs';
import { qs, qsa } from './util.mjs';

let listener = null;
export const setUpdateListener = (l) => {
    if (typeof l !== 'function') {
        console.error('Provided listener is not a function:', l);
        return;
    }
    listener = l;
}

let character = new DURF.Character();
export const getCharacter = () => character;
export const setCharacter = (c) => {
    character = new DURF.Character(c);
    update();
};

const fieldMap = {};

const update = () => {
    fieldMap['name'].value = character.name || '';
    fieldMap['str'].value = character.str || '';
    fieldMap['dex'].value = character.dex || '';
    fieldMap['wil'].value = character.wil || '';
    fieldMap['hd'].value = character.hd || '';
    fieldMap['wounds'].value = character.wounds || '';
    fieldMap['armor'].value = character.armor || '';
    fieldMap['armorMax'].value = character.armorMax || '';
    fieldMap['xp'].value = character.xp || '';
    fieldMap['numSlots'].value = character.numSlots || '';
    fieldMap['gold'].value = character.gold || '';
    fieldMap['notes'].value = character.notes || '';
    fieldMap['spells'].value = character.spells || '';

    for (let i = 0; i < fieldMap['slots'].length; i++) {
        fieldMap['slots'][i].value = character.slots[i] || '';
    }
}

const initField = (inputSelector, fieldName) => {
    const input = qs(inputSelector);
    fieldMap[fieldName] = input;
    input.addEventListener('input', (e) => {
        character[fieldName] = e.target.value;
        listener?.(fieldName, e.target.value);
    });
}

const initArrayField = (inputSelector, fieldName) => {
    const inputList = qsa(inputSelector);
    fieldMap[fieldName] = inputList;
    for (let i = 0; i < inputList.length; i++) {
        inputList[i].addEventListener('input', (e) => {
            character[fieldName][i] = e.target.value;
            listener?.(`${fieldName}:${i}`, e.target.value);
        });
    }
}

export const init = () => {
    initField('#input-name', 'name');
    initField('#input-str', 'str');
    initField('#input-dex', 'dex');
    initField('#input-wil', 'wil');
    initField('#input-hd', 'hd');
    initField('#input-wounds', 'wounds');
    initField('#input-armor-current', 'armor');
    initField('#input-armor-max', 'armorMax');
    initField('#input-xp', 'xp');
    initField('#input-num-slots', 'numSlots');
    initField('#input-gold', 'gold');
    initField('#input-notes', 'notes');
    initField('#input-spells', 'spells');

    initArrayField('.input-slot', 'slots');
}