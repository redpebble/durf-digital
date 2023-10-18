import { Database, Store } from './module/db.mjs';
import * as DURF from './module/durf.mjs';

indexedDB.deleteDatabase('durf_db');

const DB = new Database('durf_db', 1, [
    new Store('characters', 'id', new DURF.Character()),
    new Store('items', 'id', new DURF.Item()),
]);

DB.open({
    error: () => { console.error(`Database failed to open`); },
    upgradeneeded: () => { console.info(`Database upgrade needed`); },
    success: () => {
        console.info(`Database opened`);

        const rucksack = new DURF.Item({
            name: 'Rucksack of Retaining',
            description: 'A mysterious travel pack containing a rift in the very essence of spacetime. Convenient for storing stuff! Has 5 magical storage slots.'
        });

        DB.getStore('items')?.add(rucksack, {
            success: (id) => {
                console.log(id);
                DB.getStore('items')?.get(id, {
                    success: (item) => {
                        console.log(item.toString());
                        DB.getStore('items')?.put(id, item, {
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

window.DURF = DURF;