

export const HHRU = "https://api.hh.ru";


export function getQuery(obj, pars) {
    let query = '';
    if (pars) {
        for (let i = 0; i < pars.length; i++) {
            if (obj[pars[i]] != null)
                query += '&' + pars[i] + '=' + obj[pars[i]];
        }
    }
    else {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop))
                if (obj[prop] != null)
                    query += '&' + prop + '=' + obj[prop];
        }
    }
    return query;
}