import { DocsHeader } from '@/components/DocsHeader'
import Affixer from './affixer'
import fs from 'fs';

export default async function page({ params }) {
    const fototeny = fs.readFileSync('/var/www/html/vendor/hunspell/mg_MG.dic')
    const ar = fototeny.toString().split('\n')
    const n = ar.shift()
    const terms = ar.filter(it => it.length > 0)
    return <>
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
            <article>
                <DocsHeader title={params.term} />
                <Affixer term={params.term} terms={terms}/>
            </article>
        </div>
    </>
}