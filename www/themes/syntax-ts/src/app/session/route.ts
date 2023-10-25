import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';

export async function POST(request: NextRequest) {
    const selected = await request.text()
    const files = fs.readdirSync('/var/www/html/tmp/')
    
    fs.writeFileSync('/var/www/html/tmp/' + (files.length+1), selected)
    return new NextResponse((files.length+1).toString())
}