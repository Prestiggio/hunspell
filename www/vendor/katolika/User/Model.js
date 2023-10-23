import Entity from '@/Core/Entity';
import { isArray, isString, merge } from 'lodash';
import $ from 'jquery';
import Modelizer from '@/Core/Modelizer';

class Helper {

}
Modelizer(Helper)

const helper = new Helper()

const db = {
    _ax: {},
    cache: {},
    autocomplete: (table, criteria, force=false)=>{
        return new Promise((resolve, reject)=>{
            const tags = helper.cast(db.cache, table+'.'+criteria.tag, {})
            let docs = []
            for(let str in tags) {
                let r2 = new RegExp('^'+str, 'i')
                if(r2.test(criteria.value.str)) {
                    docs = tags[str]
                    break
                }
            }
            //if cache exists for matching criteria, return cache
            if(docs.length>0) {
                resolve({
                    docs: docs.filter(it=>{
                        let test = false
                        if(criteria.tags) {
                            criteria.tags.map(tag=>{
                                test = test || criteria.value.$regex.test(it[tag])
                            })
                        }
                        else {
                            test = criteria.value.$regex.test(helper.cast(it, criteria.tag))
                        }
                        return test
                    })
                })
            }
            else if(isString(table)) {
                if(!force && db._ax[table]) {
                    db._ax[table].abort()
                }
                db._ax[table] = $.ajax({
                    isProgressing : true,
                    url: `/autocomplete/${table}`,
                    data: criteria,
                    success: response=>{
                        //cache if <=10
                        if(response.entry.length>0 && response.entry.length<10) {
                            helper.descend(db.cache, table+'.'+criteria.tag+'.'+criteria.value.str, response.entry)
                        }
                        resolve({
                            docs: response.entry
                        })
                    },
                    error: e=>{
                        reject(e)
                    }
                })
            }
            else if(isArray(table)) {
                resolve({
                    docs: table.filter(it=>{
                        let test = false
                        criteria.tags.map(tag=>{
                            test = test || criteria.value.$regex.test(it[tag])
                        })
                        return test
                    })
                })
            }
        }) 
    },
    save: (table, item, uniqueBy=false)=>{
        return new Promise((resolve, reject)=>{
            if(uniqueBy) {
                if(db._ax[table]) {
                    db._ax[table].abort()
                }
                db._ax[table] = $.ajax({
                    type: 'post',
                    url: `/admin/${table}`,
                    data: item,
                    success: response=>{
                        resolve(response)
                    },
                    error: e=>{
                        reject(e)
                    }
                })
            }
        })
    },
    paginate: (table, filters, force=false)=>{
        return new Promise((resolve, reject)=>{
            if(!force && db._ax[table]) {
                db._ax[table].abort()
            }
            db._ax[table] = $.ajax({
                url: `/admin/${table}`,
                data: {
                    s: filters
                },
                success: response=>{
                    resolve({
                        docs: response.data,
                        info: response.info
                    })
                },
                error: e=>{
                    reject(e)
                }
            })
        })
    },
    find: (table, id)=>{
        return new Promise((resolve, reject)=>{
            if(db._ax[table]) {
                db._ax[table].abort()
            }
            db._ax[table] = $.ajax({
                url: `/admin/${table}/${id}`,
                success: response=>{
                    resolve(response)
                },
                error: e=>{
                    reject(e)
                }
            })
        })
    },
    delete: (table, item)=>{
        return new Promise((resolve, reject)=>{
            if(db._ax[table]) {
                db._ax[table].abort()
            }
            db._ax[table] = $.ajax({
                type: 'delete',
                url: `/admin/${table}`,
                data: item,
                success: response=>{
                    resolve(response)
                },
                error: e=>{
                    reject(e)
                }
            })
        })
    }
}

const $Ry = {
    db
}

export const WEAPI = (fn)=>{
    fn.call(null, $Ry)
}

class User extends Entity
{
    
}

const user = new User()

export default user;