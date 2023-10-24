import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';

const updateSymbol = async function(affix: any) {
    const serialcontent = fs.readFileSync('/var/www/html/vendor/hunspell/serials.json')
    const serials = JSON.parse(serialcontent.toString())
    const symbol = serials.find((it: any)=>it.code == affix.code)
    symbol.code = affix.code
    symbol.prefix = affix.prefix
    symbol.suffix = affix.suffix
    symbol.prefixReplace = affix.prefixReplace
    symbol.suffixCode = affix.suffixCode
    symbol.suffixReplace = affix.suffixReplace
    symbol.condition = affix.condition
    symbol.suffixCondition = affix.suffixCondition
    symbol.type = affix.type
    symbol.suffixReplace = affix.suffixReplace
    fs.writeFileSync('/var/www/html/vendor/hunspell/serials.json', JSON.stringify(serials))
    return symbol
}

const getOrSaveSymbol = async function(affix: any) {
    await updateSymbol(affix)
}

export async function PUT(request: NextRequest) {
    const json = await request.json()
    await getOrSaveSymbol(json)
    return new NextResponse(json.code)
}