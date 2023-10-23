import { continents as obj_continents, countries as obj_countries, getEmojiFlag } from "countries-list";

const db = openDatabase('katolika', '1.0', 'Katolika DB', 2 * 1024 * 1024);
db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS regions (name, country_id)')
    tx.executeSql('CREATE TABLE IF NOT EXISTS provinces (name, region_id)')
    tx.executeSql('CREATE TABLE IF NOT EXISTS dioceses (name, province_id)')
    tx.executeSql('CREATE TABLE IF NOT EXISTS vicariats (name, diocese_id)')
    tx.executeSql('CREATE TABLE IF NOT EXISTS districts (name, vicariat_id)')
    tx.executeSql('CREATE TABLE IF NOT EXISTS paroisses (name, district_id)')
})

const getParoisseByDistrict = async (district_id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(`SELECT rowid, name FROM paroisses WHERE district_id = ?`, [district_id], (tx, results) => {
                const paroisses = []
                for (let i = 0; i < results.rows.length; i++) {
                    paroisses.push({
                        id: results.rows.item(i).rowid,
                        name: results.rows.item(i).name
                    })
                }
                resolve(paroisses)
            }, reject)
        })
    })
}

const getDistrictByVicariat = async (vicariat_id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(`SELECT rowid, name FROM districts WHERE vicariat_id = ?`, [vicariat_id], async (tx, results) => {
                const districts = []
                for (let i = 0; i < results.rows.length; i++) {
                    let paroisses = await getParoisseByDistrict(results.rows.item(i).rowid)
                    districts.push({
                        id: results.rows.item(i).rowid,
                        name: results.rows.item(i).name,
                        paroisses
                    })
                }
                resolve(districts)
            }, reject)
        })
    })
}

const getVicariatByDiocese = async (diocese_id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(`SELECT rowid, name FROM vicariats WHERE diocese_id = ?`, [diocese_id], async (tx, results) => {
                const vicariats = []
                for (let i = 0; i < results.rows.length; i++) {
                    let districts = await getDistrictByVicariat(results.rows.item(i).rowid)
                    vicariats.push({
                        id: results.rows.item(i).rowid,
                        name: results.rows.item(i).name,
                        districts
                    })
                }
                resolve(vicariats)
            }, reject)
        })
    })
}

const getDioceseByProvince = async (province_id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(`SELECT rowid, name FROM dioceses WHERE province_id = ?`, [province_id], async (tx, results) => {
                const dioceses = []
                for (let i = 0; i < results.rows.length; i++) {
                    let vicariats = await getVicariatByDiocese(results.rows.item(i).rowid)
                    dioceses.push({
                        id: results.rows.item(i).rowid,
                        name: results.rows.item(i).name,
                        vicariats
                    })
                }
                resolve(dioceses)
            }, reject)
        })
    })
}

const getProvinceByRegion = async (region_id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(`SELECT rowid, name FROM provinces WHERE region_id = ?`, [region_id], async (tx, results) => {
                const provinces = []
                for (let i = 0; i < results.rows.length; i++) {
                    let dioceses = await getDioceseByProvince(results.rows.item(i).rowid)
                    provinces.push({
                        id: results.rows.item(i).rowid,
                        name: results.rows.item(i).name,
                        dioceses
                    })
                }
                resolve(provinces)
            }, reject)
        })
    })
}

const getRegionsByCountry = async (country_id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(`SELECT rowid, name FROM regions WHERE country_id = ?`, [country_id], async (tx, results) => {
                const regions = []
                for (let i = 0; i < results.rows.length; i++) {
                    const id = results.rows.item(i).rowid
                    let provinces = await getProvinceByRegion(id)
                    regions.push({
                        id,
                        name: results.rows.item(i).name,
                        provinces
                    })
                }
                resolve(regions)
            }, reject)
        })
    })
}

const getContinents = async () => {
    return new Promise(async (resolve, reject) => {
        const countries = []
        const continents = []
        for (let it in obj_countries) {
            let regions = await getRegionsByCountry(it)
            countries.push({
                name: obj_countries[it].name,
                id: it,
                continent_id: obj_countries[it].continent,
                flag: getEmojiFlag(it),
                regions/*: [{
                    id : `region-0-${it}`,
                    name : obj_countries[it].name,
                    provinces : [{
                        id : `region-0-${it}-province-0`,
                        name: obj_countries[it].capital,
                        dioceses: []
                    }]
                }]*/
            })
        }
        Object.keys(obj_continents).map(it => {
            continents.push({
                name: obj_continents[it],
                id: it,
                countries: countries.filter(it2 => it2.continent_id == it)
            })
        })
        resolve(continents)
    })
}

const World = {
    getContinents,
    paroisse: {
        show: async id=>{
            return new Promise((resolve, reject)=>{
                db.transaction(tx => {
                    tx.executeSql(`SELECT * FROM paroisses WHERE rowid = ?`, [parseInt(id)], (tx, results) => {
                        if(results.rows.length>0) {
                            resolve(results.rows.item(0))
                        }
                        else {
                            resolve(null)
                        }
                    }, reject)
                })
            })
        },
        update: async (data, id)=>{
            return new Promise((resolve, reject)=>{
                db.transaction(tx => {
                    tx.executeSql(`UPDATE paroisses SET name = ? WHERE rowid = ?`, [data.name, parseInt(id)], tx => {
                        resolve()
                    }, reject)
                })
            })
        }
    }
}

export default World;