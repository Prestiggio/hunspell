import fs from 'fs'
import GroupForm from './Form'

export default async function page({ params }:any) {
    const session = fs.readFileSync('/var/www/html/tmp/' + params.group)
    const selected = JSON.parse(session.toString())
    const fototeny = fs.readFileSync('/var/www/html/vendor/hunspell/terms.json')
    const ar = JSON.parse(fototeny.toString())
    return <>
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
            <article>
                <GroupForm terms={ar} affixes={selected}/>
            </article>
        </div>
    </>
}