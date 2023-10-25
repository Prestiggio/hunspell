import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import _ from 'lodash';

const saveDic = async function(term: any) {
    const content = fs.readFileSync('/var/www/html/vendor/hunspell/terms.json')
    const terms = JSON.parse(content.toString())
    const t = terms.find((it:any)=>it.term == term.term)
    t.groups = term.groups
    if(term.nogroups) {
        t.nogroups = term.nogroups
    }
    fs.writeFileSync('/var/www/html/vendor/hunspell/terms.json', JSON.stringify(terms))
}

export async function POST(request: NextRequest) {
    const json = await request.json()
    json.term.groups = _.uniq(json.term.groups)
    const symbol:any = await saveDic(json.term)
    return new NextResponse(json.term.term)
}

export async function DELETE(request: NextRequest) {
    const fototeny = fs.readFileSync('/var/www/html/vendor/hunspell/mg_MG.dic')
    const ar = fototeny.toString().split('\n')
    ar.shift()
    let terms: any[] = []
    let index = 0
    ar.map(a=>{
        index++
        terms.push({
            index,
            term: a,
            groups: [],
            nogroups: []
        })
    })
    fs.writeFileSync('/var/www/html/vendor/hunspell/terms.json', JSON.stringify(terms))
    return NextResponse.json({
        status: 'reseted'
    })
}