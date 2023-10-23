import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';

const getSymbol = async function(id: number, affix: string, condition: string, type: string = 'CIRCUMFIX') {
    const serialcontent = fs.readFileSync('/var/www/html/vendor/hunspell/serials.json')
    const serials = JSON.parse(serialcontent.toString())
    return serials.find((it: any)=>it.id == id || (it.condition == condition && it.affix == affix && it.type == type))
}

const saveSymbol = async function(id: number, affix: string, condition: string, type: string = 'CIRCUMFIX') {
    const serialcontent = fs.readFileSync('/var/www/html/vendor/hunspell/serials.json')
    const serials = JSON.parse(serialcontent.toString())
    const available = serials.find((it: any)=>!it.condition && !it.affix && !it.type && !it.id)
    available.id = id
    available.affix = affix
    available.condition = condition
    available.type = type
    fs.writeFileSync('/var/www/html/vendor/hunspell/serials.json', JSON.stringify(serials))
    return available
}

const updateSymbol = async function(id: number, affix: string, condition: string, type: string = 'CIRCUMFIX') {
    const serialcontent = fs.readFileSync('/var/www/html/vendor/hunspell/serials.json')
    const serials = JSON.parse(serialcontent.toString())
    const symbol = serials.find((it: any)=>it.id == id)
    symbol.affix = affix
    symbol.condition = condition
    symbol.type = type
    fs.writeFileSync('/var/www/html/vendor/hunspell/serials.json', JSON.stringify(serials))
    return symbol
}

const getOrSaveSymbol = async function(id: number, affix: string, condition: string, type: string = 'CIRCUMFIX') {
    let symbol = await getSymbol(id, affix, condition, type)
    if(!symbol) {
        symbol = await saveSymbol(id, affix, condition, type)
    }
    else {
        await updateSymbol(id, affix, condition, type)
    }
    return symbol
}

export async function PUT(request: NextRequest) {
    const json = await request.json()
    const symbol = await getOrSaveSymbol(json.id, json.affix, json.condition, json.type)
    return new NextResponse(symbol.code)
}