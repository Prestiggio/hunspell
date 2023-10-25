'use client'

import React, { Component } from 'react'
import { XCircleIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { useRouter } from "next/router"

const getOrSaveSymbol = async function(affix) {
    const response = await fetch('/affix', {
        method: 'PUT',
        body: JSON.stringify(affix)
    })
    const r = await response.text()
    return r
}

class AffixBlock extends Component
{
    render() {
        const affix = this.props.affix
        switch(affix.type) {
            case 'PFX':
                return <div className='my-4 bg-slate-200'>
                    PFX {affix.code} N 1<br/>
                    PFX {affix.code} {affix.prefixReplace} {affix.prefix} {affix.condition}
                </div>
            case 'SFX':
                return <div className='my-4 bg-slate-200'>
                    SFX {affix.code} N 1<br/>
                    SFX {affix.code} {affix.suffixReplace} {affix.suffix} {affix.suffixCondition}
                </div>
            default:
                return <>
                    <div className='my-4 bg-slate-200'>
                        PFX {affix.code} Y 1<br/>
                        PFX {affix.code} {affix.prefixReplace} {affix.prefix}/Xx {affix.condition}
                    </div>
                    <div className='my-4 bg-slate-200'>
                        SFX {affix.suffix_code} Y 1<br/>
                        SFX {affix.suffix_code} {affix.suffixReplace} {affix.suffix}/Xx {affix.suffixCondition}
                    </div>
                </>
        }
    }
}

class AffixItem extends Component {
    constructor(props) {
        super(props)
        const reste = this.props.term.term.substr(parseInt(this.props.affix.prefixReplace)).substr(0, this.props.term.length)
        const result = this.props.affix.prefix + reste
        this.state = {
            reste,
            result,
            affix: this.props.affix
        }
        this.applyPrefix = this.applyPrefix.bind(this)
        this.applyPrefixReplacement = this.applyPrefixReplacement.bind(this)
        this.applyCondition = this.applyCondition.bind(this)
        this.compileResult = this.compileResult.bind(this)
    }

    applyCondition(e) {
        const condition = e.target.value
        this.setState(state => {
            state.affix.condition = condition
            return state
        }, this.compileResult)
    }

    applyPrefix(e) {
        const prefix = e.target.value
        this.setState(state => {
            state.affix.prefix = prefix
            return state
        }, this.compileResult)
    }

    applyPrefixReplacement(e) {
        const prefixReplace = e.target.value
        this.setState(state => {
            state.affix.prefixReplace = prefixReplace
            return state
        }, this.compileResult)
    }

    async compileResult() {
        this.setState(async state => {
            state.reste = this.props.term.term.substr(parseInt(state.affix.prefixReplace))
            state.result = state.affix.prefix + state.reste
            state.affix.code = await getOrSaveSymbol(state.affix)
            return state
        })
    }

    render() {
        return <tr className='even:bg-gray-50'>
            <td>
                <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-600"
                    onChange={this.props.onChange}
                />
            </td>
            <td>
                <input type='text' className='form-input w-24' value={this.state.affix.condition} placeholder='[aeio]' onChange={this.applyCondition} />
            </td>
            <td>
                <input type='text' className='form-input w-24' value={this.state.affix.prefix} placeholder='Prefixe' onChange={this.applyPrefix} />
            </td>
            <td>
                <input type='number' className='form-input w-24' value={this.state.affix.prefixReplace} placeholder='0' onChange={this.applyPrefixReplacement} />
            </td>
            <td>
                {this.state.reste}
            </td>
            <td>

            </td>
            <td>

            </td>
            <td>

            </td>
            <th>
                {this.state.result}
            </th>
            <td>
                <Link href={`/prefix/${this.state.affix.code}`}>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </Link>
            </td>
        </tr>
    }
}

class Form extends Component
{
    #form = React.createRef()

    constructor(props) {
        super(props)
        this.state = {
            t: 0,
            regex: '',
            valid_regex: '',
            affixes: this.props.affixes,
            selected: []
        }
        this.applyRegex = this.applyRegex.bind(this)
        this.applySyllabus = this.applySyllabus.bind(this)
        this.add = this.add.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.selectTerms = this.selectTerms.bind(this)
        this.resetTerms = this.resetTerms.bind(this)
    }

    async resetTerms() {
        const response = await fetch('/dic', {
            method: 'DELETE'
        })
        const result = await response.text()
        alert(result)
    }

    handleCheck(e, affix) {
        const checked = e.target.checked
        let selected = this.state.selected
        if(checked) {
            selected.push(affix)
        }
        else {
            selected = selected.filter(it=>it.code!=affix.code)
        }
        this.setState({selected})
    }

    async selectTerms() {
        const response = await fetch('/session', {
            method: 'POST',
            body: JSON.stringify(this.state.selected)
        })
        const session = await response.text()
        document.location.href = '/group/' + session
    }

    applyRegex(e) {
        const regex = e.target.value
        let valid_regex = ''
        try {
            valid_regex = new RegExp(regex)
        }
        catch (e) {
            valid_regex = this.state.valid_regex
        }
        let t = this.state.t
        t++
        this.setState({ regex, valid_regex, t })
    }

    applySyllabus(e) {
        const nsyllabus = e.target.value
        this.setState({ nsyllabus })
    }

    add(type = 'CIRCUMFIX') {
        const available = this.state.affixes.find(it=>!it.type)
        this.setState((state) => {
            const av = state.affixes.find(it=>it.code === available.code)
            av.type = type
            av.prefixReplace = 0
            av.suffixReplace = 0
            av.prefix = ''
            av.suffix = ''
            return state
        })
    }

    render() {
        return <>
            <input type='text' className='form-input' value={this.state.regex} placeholder='regex' onChange={this.applyRegex} />
            <input type='text' className='form-input' value={this.state.syllabus} placeholder='syllabe' onChange={this.applySyllabus} />
            <button type='button' className='btn' onClick={() => this.add('PFX')}>Ajouter PFX</button>
            <button type='button' className='btn' onClick={this.resetTerms}>Réinitialiser les termes</button>
            <button type='button' className='btn' onClick={this.selectTerms}>Termes</button>
            <table className='min-w-full divide-y divide-gray-300 my-4'>
                <tbody className='bg-white'>
                    {this.state.affixes.filter(it=>it.type).map(affix => <AffixItem onChange={e=>this.handleCheck(e, affix)} affix={affix} term={this.props.terms.filter(it => this.state.nsyllabus > 0 ? (new RegExp(`^([aeio].?){${this.state.nsyllabus}}$`)).test(it.term) : true).find(it=>(new RegExp(this.state.valid_regex)).test(it.term))} key={`${affix.code}-${this.state.t}`} />)}
                </tbody>
            </table>
            {this.state.affixes.filter(it=>it.type).map(affix => <AffixBlock key={affix.code} affix={affix}/>)}
        </>
    }
}

export default Form