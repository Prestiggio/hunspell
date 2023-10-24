import { type Node } from '@markdoc/markdoc'

import { DocsHeader } from '@/components/DocsHeader'
import { PrevNextLinks } from '@/components/PrevNextLinks'
import { execShellCommand } from '@/api'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

import trans from "@/Core/next-translations";
import fs from 'fs';
import Link from 'next/link'

export default async function page({ searchParams }) {
    let serials: any[] = []
    const fototeny = fs.readFileSync('/var/www/html/vendor/hunspell/mg_MG.dic')
    const ar = fototeny.toString().split('\n')
    const n = ar.shift()
    if(!fs.existsSync('/var/www/html/vendor/hunspell/serials.json')) {
        let codes = []
        let alphas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')
        let numbers = "0123456789absdefghijklmnopqrstuvwxyz.,'".split('')
        for(let alpha of alphas) {
            for(let n of numbers) {
                if(alpha==='X' && n === 'x') {
                    continue
                }
                codes.push(`${alpha}${n}`)
            }
        }
        codes.reverse()
        for(let code of codes) {
            serials.push({
                code
            })
        }
        fs.writeFileSync('/var/www/html/vendor/hunspell/serials.json', JSON.stringify(serials))
        let terms: any[] = []
        ar.map(a=>{
            terms.push({
                term: a,
                groups: []
            })
        })
        fs.writeFileSync('/var/www/html/vendor/hunspell/terms.json', JSON.stringify(terms))
    }
    else {
        const serialcontent = fs.readFileSync('/var/www/html/vendor/hunspell/serials.json')
        serials = JSON.parse(serialcontent.toString())
    }
    const result = await execShellCommand('wordforms mg_MG3.aff mg_MG3.dic ' + searchParams.term)
    return <>
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
            <article>
                <DocsHeader title={trans('Getting start')} />
                <h1>{n} : {ar.filter(it => it.length > 0).length}</h1>
                <ul role="list" className="divide-y divide-gray-100">
                    {ar.filter(it => it.length > 0).map((a) => (
                        <li key={a} className="relative flex justify-between items-center hover:bg-gray-50">
                            <Link href={`/${a}/variants`}>
                                {a}
                            </Link>
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </li>
                    ))}
                </ul>
            </article>
            <PrevNextLinks />
        </div>
    </>
}