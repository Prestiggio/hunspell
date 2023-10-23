const db = openDatabase('katolika', '1.0', 'Katolika DB', 2 * 1024 * 1024);
db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS baptemes (bapteme_name, firstname, middlename, lastname, gender, birthday, legitime, parent1, parent2, parent3, godparent1, godparent2, missionnaire1, missionnaire2, missionnaire3, paroisse_id, place, registration_id, adresse, user_id, bapteme_at, created_at, updated_at)')
})

const DB = {
    bapteme : {
        insert : async data=>{
            return new Promise((resolve, reject)=>{
                db.transaction(tx=>{
                    tx.executeSql('INSERT INTO baptemes (bapteme_name, firstname, lastname, gender, birthday, legitime, parent1, parent2, parent3, godparent1, godparent2, missionnaire1, missionnaire2, missionnaire3, paroisse_id, place, registration_id, adresse, bapteme_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                        data.bapteme_name,
                        data.firstname,
                        data.lastname,
                        data.gender,
                        data.birthday,
                        data.legitime,
                        data.parent1,
                        data.parent2,
                        data.parent3,
                        data.godparent1,
                        data.godparent2,
                        data.missionnaire1,
                        data.missionnaire2,
                        data.missionnaire3,
                        data.paroisse_id,
                        data.place,
                        data.registration_id,
                        data.adresse,
                        data.bapteme_at,
                        data.created_at,
                        data.updated_at
                    ], (tx)=>{
                        resolve()
                    }, reject)
                })
            })
        },
        update : async (data, rowid)=>{
            return new Promise((resolve, reject)=>{
                db.transaction(tx=>{
                    tx.executeSql('UPDATE baptemes SET bapteme_name = ?, firstname = ?, lastname = ?, gender = ?, birthday = ?, legitime = ?, parent1 = ?, parent2 = ?, parent3 = ?, godparent1 = ?, godparent2 = ?, missionnaire1 = ?, missionnaire2 = ?, missionnaire3 = ?, place = ?, registration_id = ?, adresse = ?, bapteme_at = ?, updated_at = ? WHERE rowid = ?', [
                        data.bapteme_name,
                        data.firstname,
                        data.lastname,
                        data.gender,
                        data.birthday,
                        data.legitime,
                        data.parent1,
                        data.parent2,
                        data.parent3,
                        data.godparent1,
                        data.godparent2,
                        data.missionnaire1,
                        data.missionnaire2,
                        data.missionnaire3,
                        data.place,
                        data.registration_id,
                        data.adresse,
                        data.bapteme_at,
                        data.updated_at,
                        rowid
                    ], (tx)=>{
                        resolve()
                    }, reject)
                })
            })
        },
        delete: async id=>{
            return new Promise((resolve, reject)=>{
                db.transaction(tx=>{
                    tx.executeSql('DELETE FROM baptemes WHERE rowid = ?', [id], tx=>{
                        resolve()
                    }, reject)
                })
            })
        },
        paginate : async data=>{
            return new Promise((resolve, reject)=>{
                db.transaction(tx=>{
                    tx.executeSql('SELECT rowid, bapteme_name, firstname, lastname, gender, birthday, legitime, parent1, parent2, parent3, godparent1, godparent2, missionnaire1, missionnaire2, missionnaire3, paroisse_id, place, registration_id, adresse, bapteme_at, created_at, updated_at FROM baptemes LIMIT 0, 10', [], (tx, results)=>{
                        const ar = []
                        const len = results.rows.length
                        for(let i=0; i<len; i++) {
                            ar.push(results.rows.item(i))
                        }
                        resolve(ar)
                    }, reject)
                })
            })
        },
        show : async id=>{
            return new Promise((resolve, reject)=>{
                db.transaction(tx=>{
                    tx.executeSql('SELECT rowid, bapteme_name, firstname, lastname, gender, birthday, legitime, parent1, parent2, parent3, godparent1, godparent2, missionnaire1, missionnaire2, missionnaire3, paroisse_id, place, registration_id, adresse, bapteme_at, created_at, updated_at FROM baptemes WHERE rowid = ?', [id], (tx, results)=>{
                        if(results.rows.length>0) {
                            resolve(results.rows.item(0))
                        }
                        else {
                            resolve(null)
                        }
                    }, reject)
                })
            })
        }
    }
}

export default DB;