import https from 'https';
import fs from 'fs';
import moment from 'moment';
import { exec } from 'child_process';
import 'dotenv/config';

export const execShellCommand = async (cmd)=>{
    return new Promise((resolve, reject) => {
        exec(cmd, {
            cwd: '/var/www/html/vendor/hunspell'
        }, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

export const insertTerm = async function(term) {
    const token = await getToken()
    
    return new Promise((resolve, reject) => {
        const options = {
            hostname: process.env.API_ENDPOINT,
            port: 443,
            path: '/dm/mg/terms',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "User-Agent": "Datamino",
                'Authorization': 'Bearer ' + token.access_token
            }
        }
        const req = https.request(options, (res) => {
            let responseData = ''
            res.on('data', (chunk) => {
                responseData += chunk
            })
            res.on('end', () => {
                const response = JSON.parse(responseData)
                resolve(response)
            })
        })
        req.write(JSON.stringify({
            term
        }))
        req.end()
    })
}

export const listTerms = async function() {
    const token = await getToken()
    
    return new Promise((resolve, reject) => {
        const options = {
            hostname: process.env.API_ENDPOINT,
            port: 443,
            path: '/dm/mg/terms',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "User-Agent": "Datamino",
                'Authorization': 'Bearer ' + token.access_token
            }
        }
        const req = https.request(options, (res) => {
            let responseData = ''
            res.on('data', (chunk) => {
                responseData += chunk
            })
            res.on('end', () => {
                const response = JSON.parse(responseData)
                resolve(response)
            })
        })
        req.end()
    })
}

export const setupTerms = async function() {
    let rawterms = fs.readFileSync('mg_MG2.dic')
    let terms = rawterms.toString().split(/\n/).filter(it=>it.length>0 && /\w+/.test(it))
    let i = -1
    for(let term of terms) {
        i++
        if(isNaN(term) && i>824) {
            insertTerm(term)
        }
    }
}

export const updateAffix = async function(affix) {
    const token = await getToken()
    
    return new Promise((resolve, reject) => {
        const options = {
            hostname: process.env.API_ENDPOINT,
            port: 443,
            path: '/dm/mg/affixes/' + affix.id,
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "User-Agent": "Datamino",
                'Authorization': 'Bearer ' + token.access_token
            }
        }
        const req = https.request(options, (res) => {
            let responseData = ''
            res.on('data', (chunk) => {
                responseData += chunk
            })
            res.on('end', () => {
                const response = JSON.parse(responseData)
                resolve(response)
            })
        })
        req.write(JSON.stringify(affix))
        req.end()
    })
}

export const insertRule = async function(rule) {
    const token = await getToken()
    
    return new Promise((resolve, reject) => {
        const options = {
            hostname: process.env.API_ENDPOINT,
            port: 443,
            path: '/dm/mg/rules',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "User-Agent": "Datamino",
                'Authorization': 'Bearer ' + token.access_token
            }
        }
        const req = https.request(options, (res) => {
            let responseData = ''
            res.on('data', (chunk) => {
                responseData += chunk
            })
            res.on('end', () => {
                const response = JSON.parse(responseData)
                resolve(response)
            })
        })
        req.write(JSON.stringify(rule))
        req.end()
    })
}

export const insertAffix = async function(affix) {
    const token = await getToken()
    
    return new Promise((resolve, reject) => {
        const options = {
            hostname: process.env.API_ENDPOINT,
            port: 443,
            path: '/dm/mg/affixes',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "User-Agent": "Datamino",
                'Authorization': 'Bearer ' + token.access_token
            }
        }
        const req = https.request(options, (res) => {
            let responseData = ''
            res.on('data', (chunk) => {
                responseData += chunk
            })
            res.on('end', () => {
                const response = JSON.parse(responseData)
                resolve(response)
            })
        })
        req.write(JSON.stringify(affix))
        req.end()
    })
}

export const insert = async function(affixes) {
    const token = await getToken()
    
    return new Promise((resolve, reject) => {
        const options = {
            hostname: process.env.API_ENDPOINT,
            port: 443,
            path: '/dm/mg/affixdump',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "User-Agent": "Datamino",
                'Authorization': 'Bearer ' + token.access_token
            }
        }
        const req = https.request(options, (res) => {
            let responseData = ''
            res.on('data', (chunk) => {
                responseData += chunk
            })
            res.on('end', () => {
                const response = JSON.parse(responseData)
                resolve(response)
            })
        })
        req.write(JSON.stringify(affixes))
        req.end()
    })
}

export const dump = async function() {
    const token = await getToken()
    
    return new Promise((resolve, reject) => {
        const options = {
            hostname: process.env.API_ENDPOINT,
            port: 443,
            path: '/dm/mg/affixdump',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "User-Agent": "Datamino",
                'Authorization': 'Bearer ' + token.access_token
            }
        }
        const req = https.request(options, (res) => {
            let responseData = ''
            res.on('data', (chunk) => {
                responseData += chunk
            })
            res.on('end', () => {
                const response = JSON.parse(responseData)
                resolve(response)
            })
        })
        req.end()
    })
}

export const update = async function(data) {
    const token = await getToken()
    
    return new Promise((resolve, reject) => {
        const options = {
            hostname: process.env.API_ENDPOINT,
            port: 443,
            path: '/dm/mg/affixdump/',
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "User-Agent": "Datamino",
                'Authorization': 'Bearer ' + token.access_token
            }
        }
        const req = https.request(options, (res) => {
            let responseData = ''
            res.on('data', (chunk) => {
                responseData += chunk
            })
            res.on('end', () => {
                const response = JSON.parse(responseData)
                resolve(response)
            })
        })
        req.write(JSON.stringify(data))
        req.end()
    })
}

export const insertTermAffix = async function(termAffix) {
    const token = await getToken()
    
    return new Promise((resolve, reject) => {
        const options = {
            hostname: process.env.API_ENDPOINT,
            port: 443,
            path: '/dm/mg/term-affixes',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "User-Agent": "Datamino",
                'Authorization': 'Bearer ' + token.access_token
            }
        }
        const req = https.request(options, (res) => {
            let responseData = ''
            res.on('data', (chunk) => {
                responseData += chunk
            })
            res.on('end', () => {
                const response = JSON.parse(responseData)
                resolve(response)
            })
        })
        req.write(JSON.stringify(termAffix))
        req.end()
    })
}

const getToken = async function () {
    return new Promise((resolve, reject) => {
        if (fs.existsSync('tmp/access_token.json')) {
            let authdata = fs.readFileSync('tmp/access_token.json')
            let auth = JSON.parse(authdata)
            if (auth.end && moment().isBefore(moment(auth.end))) {
                resolve(auth)
                return
            }
        }

        const client_id = process.env.API_KEY
        const client_secret = process.env.API_SECRET
        const authOptions = {
            hostname: process.env.API_ENDPOINT,
            port: 443,
            path: '/authorization/token',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
            }
        }
        const authReq = https.request(authOptions, (res) => {
            let responseData = []
            res.on('data', (chunk) => {
                responseData.push(chunk)
            })
            res.on('end', () => {
                const body = Buffer.concat(responseData)
                const response = JSON.parse(body.toString())

                let res = response
                res.end = moment().add(res.expires_in, 's')

                fs.writeFileSync('tmp/access_token.json', JSON.stringify(res))

                resolve(res)
            })
        })

        authReq.write(JSON.stringify({
            grant_type: 'client_credentials'
        }))
        authReq.end()
    })
}

export default getToken;
