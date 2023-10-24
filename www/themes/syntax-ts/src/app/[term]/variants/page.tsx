import { DocsHeader } from '@/components/DocsHeader'
import Affixer from './affixer'
import fs from 'fs';

export default async function page({ params }) {
    const fototeny = fs.readFileSync('/var/www/html/vendor/hunspell/terms.json')
    const ar = JSON.parse(fototeny.toString())
    const affixes = fs.readFileSync('/var/www/html/vendor/hunspell/serials.json')
    const araffixes = JSON.parse(affixes.toString())
    return <>
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
            <article>
                <DocsHeader title={params.term} />
                <Affixer term={params.term} terms={ar} affixes={araffixes}/>
            </article>
        </div>
    </>
}