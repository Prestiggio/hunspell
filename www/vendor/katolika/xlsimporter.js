const xlsx = require('node-xlsx').default;
const moment = require('moment');
const db = require('../desktop/database');
//import fs from 'fs';

//const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`/Volumes/wilfrid/empire/var/www/katolika/REGISTRE 2021/BAPTEME 2021.xlsx`));

const getFN = str=>{
    let ar = str.split(' ')
    return ar.filter(it=>/^[A-Z][a-z]+$/.test(it)).join(' ')
}

const getLN = str=>{
    let ar = str.split(' ')
    return ar.filter(it=>/^[A-Z]+$/.test(it)).join(' ')
}

const parse = async file=>{
    console.log('miaingaaaa' , file)
    const workSheetsFromFile = xlsx.parse(file, {
        cellDates: true
    });

    const church = await db.churches.get('church1')
    church.fullname = `${church.saint.prefix} ${church.saint.name} ${church.name}`
    
    let users = []
    let previous;
    workSheetsFromFile[0].data.map((line, index)=>{
        if(index==0)
            return;
        if(line[0]) {
            let user = {
                firstname: getFN(line[1]),
                lastname: getLN(line[1]),
                address: line[3],
                birthdate: moment(line[4], 'DD/MM/YYYY').format(),
                sacrements: {
                    batemy: {
                        status: 1,
                        reference: line[11],
                        church,
                        missionaries: {
                            missionary1: {
                                firstname: getFN(line[6].replace(/^P\./, '')),
                                lastname: getLN(line[6].replace(/^P\./, ''))
                            }
                        },
                        note: line[7]
                    },
                    others: line[8],
                    deceased: line[10]
                }
            }
            if(line[9]) {
                user.sacrements.mariazy = {
                    status: 1,
                    to: line[9]
                }
            }
            if(line[2]) {
                user.father = {
                    firstname: getFN(line[2]),
                    lastname: getLN(line[2]),
                }
            }
            if(line[5]) {
                user.sacrements.batemy.godparent = {
                    firstname: getFN(line[5]),
                    lastname: getLN(line[5]),
                }
            }
            if(line[7] || line[8] || line[9] || line[10]) {
                console.log('saisie manuel ID ', index)
            }
            if(line[0] && line[0].constructor.name==='Date') {
                user.sacrements.batemy.date =  moment(line[0]).add(12, 'hours').format()
            }
            else {
                user.sacrements.batemy.date = line[0]
            }
            users.push(user)
            previous = user
        }
        else if(previous && line[2]) {
            previous.mother = {
                firstname: getFN(line[2]),
                lastname: getLN(line[2])
            }
        }
    })

    for(let i=0; i<users.length; i++) {
        await db.saveUser(users[i])
    }
    
    return users
}

//parse(`/Volumes/wilfrid/empire/var/www/katolika/REGISTRE 2021/BAPTEME 2021.xlsx`);

exports.parse = parse;