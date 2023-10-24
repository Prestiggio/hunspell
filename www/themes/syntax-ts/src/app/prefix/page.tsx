import fs from 'fs'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import PrefixForm from './Form'

export default function page() {
    const serialcontent = fs.readFileSync('/var/www/html/vendor/hunspell/serials.json')
    const affixes = JSON.parse(serialcontent.toString())
    const fototeny = fs.readFileSync('/var/www/html/vendor/hunspell/terms.json')
    const terms = JSON.parse(fototeny.toString())
    return <>
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
            <article>
                <PrefixForm affixes={affixes} terms={terms}/>
                <ul role="list" className="divide-y divide-gray-100">
                    {affixes.filter((it:any) => it.type==='PFX').map((a:any) => (
                        <li key={a.code} className="relative flex justify-between items-center hover:bg-gray-50">
                            <Link href={`/prefix/${a.prefix}`} className='flex-1'>
                                {a.prefix}
                            </Link>
                            <div className='flex-1'>
                                {a.prefixReplace}
                            </div>
                            <div className='flex-1'>
                                {a.condition}
                            </div>
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </li>
                    ))}
                </ul>
            </article>
        </div>
    </>
}