import * as LS from './module/localstorage.mjs';
import * as DB from './module/db.mjs';
import * as DURF from './module/durf.mjs';
import * as SHEET from './module/sheet.mjs';

LS.setClassMap({'character': DURF.Character});

indexedDB.deleteDatabase('durf_db');

const DURF_DB = new DB.Database('durf_db', 1, [
    new DB.Store('characters', 'id', DURF.Character),
    new DB.Store('items', 'id', DURF.Item),
]);

DURF_DB.open({
    error: () => { console.error(`Database failed to open`); },
    upgradeneeded: () => { console.info(`Database upgrade needed`); },
    success: () => {
        console.info(`Database opened`);

        const rucksack = new DURF.Item({
            name: 'Rucksack of Retaining',
            description: 'A mysterious travel pack containing a rift in the very essence of spacetime. Convenient for storing stuff! Has 5 magical storage slots.'
        });

        DURF_DB.getStore('items')?.add(rucksack, {
            success: (id) => {
                console.log(id);
                DURF_DB.getStore('items')?.get(id, {
                    success: (item) => {
                        console.log(item.toString());
                        DURF_DB.getStore('items')?.put(id, item, {
                            success: (id) => {
                                console.log(id);
                            },
                            error: (e) => {
                                console.error('error', e);
                            }
                        });
                    }
                });
            }
        });
    }
});

SHEET.init();
SHEET.setCharacter(LS.getItem('character'));
SHEET.setUpdateListener(() => {
    LS.setItem('character', SHEET.getCharacter());
});

window.LS = LS;