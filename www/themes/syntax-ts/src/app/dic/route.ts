import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import _ from 'lodash';

const saveDic = async function(terms: any[]) {
    fs.writeFileSync('/var/www/html/vendor/hunspell/terms.json', JSON.stringify(terms))
}

export async function POST(request: NextRequest) {
    const json = await request.json()
    json.terms.map((it:any)=>{
        it.groups = _.uniq(it.groups)
    })
    const symbol = await saveDic(json.terms)
    return new NextResponse(symbol.code)
}