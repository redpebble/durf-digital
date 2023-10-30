import * as DURF from './durf.mjs';
import { qs, qsa } from './util.mjs';

let listener = null;
export const setUpdateListener = (l) => {
    if (typeof l !== 'function') {
        console.error('provided listener is not a function:', l);
        return;
    }
    listener = l;
}

let character = new DURF.Character();
export const getCharacter = () => character;
export const setCharacter = (c) => {
    character = c || new DURF.Character();
    console.log(character.toString());
    update();
};

const fieldMap = {};

const initNumberField = (inputSelector, fieldName) => {
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
    initNumberField('#input-name', 'name');
    initNumberField('#input-str', 'str');
    initNumberField('#input-dex', 'dex');
    initNumberField('#input-wil', 'wil');
    initNumberField('#input-hd', 'hd');
    initNumberField('#input-wounds', 'wounds');
    initNumberField('#input-armor-current', 'armor');
    initNumberField('#input-armor-max', 'armorMax');
    initNumberField('#input-xp', 'xp');
    initNumberField('#input-num-slots', 'numSlots');
    initNumberField('#input-gold', 'gold');
    initNumberField('#input-notes', 'notes');
    initNumberField('#input-spells', 'spells');

    initArrayField('.input-slot', 'slots');
}

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