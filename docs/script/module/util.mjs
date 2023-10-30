export const qs = (s) => document.querySelector(s);
export const qsa = (s) => document.querySelectorAll(s);

export const download = (name, type, dataUri) => {
    name = sanitize(name);
    type = sanitize(type);
    if (name === '') name = 'download';
    if (type === '') type = 'txt';

    let link = document.createElement('a');
    link.setAttribute('download', `${name}.${type}`);
    link.setAttribute('href', dataUri);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const sanitize = (str) => {
    if (!str) return '';
    str = str.toLowerCase()
        .replaceAll(/[\"\']/g, '')
        .replaceAll(/\s+/g, '-')
        .replaceAll(/[^a-z0-9\-\"\']/g, '_');
    return str;
}