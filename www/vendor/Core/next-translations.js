export const TCOUNTER = {
    AJAX : 0
}

export const locale = 'mg'

export const DATES = {
    "dateTime": "%A, %e %B %Y г. %X",
    "date": "%d.%m.%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
    "shortDays": ["lu", "ma", "me", "je", "ve", "sa", "di"],
    months : ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"],
    shortMonths: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]
}

export const siteSetup = {
    general : {
        logo : ''
    }
}

export default function trans(input, replaces={}) {
	let result = input
    for(let repl in replaces) {
        let by = replaces[repl]
        let re = new RegExp(`:${repl}`, "g");
        result = result.replace(re, by)
    }
	return result;
}

export function plural(word, params, ifplural=null, ifnone=null){
    let number = 0
    if(typeof params == 'object')
        number = params.n
    else {
        number = params
        params = {n:number}
    }
    if(number==0 && ifnone) {
        return trans(ifnone, params)
    }
    const isPlural = (number>1)
    if(isPlural)
        return ifplural ? trans(ifplural, params) : `${trans(word, params)}s`
    return trans(word, params)
}

export const genders = {
    mr : trans('M'),
    mrs : trans('Mme'),
    ms : trans('Mlle')
}
