import { download, qs } from "./util.mjs";
import * as LS from './storage.mjs';
import * as SHEET from './sheet.mjs';

const exportCharacter = () => {
    const c = SHEET.getCharacter();
    const dataUri = `data:application/json,${encodeURIComponent(JSON.stringify(c))}`;
    download(c.name, 'durfpc', dataUri);
}

const importCharacter = (file) => {
    if (file) {
        let reader = new FileReader();
        reader.onload = (e) => {
            try {
                SHEET.setCharacter(JSON.parse(e.target?.result));
            } catch(err) {
                console.error('Something went wrong with config load', err);
            }
        }
        reader.readAsText(file);
    } else {
        console.error('No file selected');
    }
}

export const init = () => {
    qs('#input-export').addEventListener('click', (e) => {
        exportCharacter();
    });

    qs('#input-import').addEventListener('input', (e) => {
        importCharacter(e.target.files?.item(0));
    });

    qs('#input-clear').addEventListener('click', (e) => {
        // todo: confirm dialog
        SHEET.setCharacter();
    });

    SHEET.init();
    SHEET.setCharacter(LS.getItem('character'));
    SHEET.setUpdateListener(() => {
        LS.setItem('character', SHEET.getCharacter());
    });
}