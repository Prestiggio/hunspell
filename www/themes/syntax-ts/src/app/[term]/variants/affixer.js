'use client'

import React, { Component } from 'react'
import Link from 'next/link'
import { ChevronRightIcon, XCircleIcon, ChevronLeftIcon } from '@heroicons/react/20/solid'
import { configureStore } from '@reduxjs/toolkit'

const AmDifferedState = (state = 0, action) => action;

const store = configureStore({
    reducer: AmDifferedState
});

const CST = {
    GPES: {}
}

const getOrSaveSymbol = async function(id, affix, condition, type = 'CIRCUMFIX') {
    const response = await fetch('/affix', {
        method: 'PUT',
        body: JSON.stringify({
            id,
            affix,
            condition,
            type
        })
    })
    const r = await response.text()
    return r
}

const saveDic = async function(terms) {
    console.log('reirerie', terms)
    const response = await fetch('/dic', {
        method: 'POST',
        body: JSON.stringify({terms})
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
                    SFX {affix.code} {affix.suffixReplace} {affix.suffix} {affix.condition}
                </div>
            default:
                return <>
                    <div className='my-4 bg-slate-200'>
                        PFX {affix.code} Y 1<br/>
                        PFX {affix.code} {affix.prefixReplace} {affix.prefix}/Xx {affix.condition}
                    </div>
                    <div className='my-4 bg-slate-200'>
                        SFX {affix.suffix_code} Y 1<br/>
                        SFX {affix.suffix_code} {affix.suffixReplace} {affix.suffix}/Xx {affix.suffix_condition}
                    </div>
                </>
        }
    }
}

class Family extends Component {
    constructor(props) {
        super(props)
        this.state = {
            affixes : this.props.affixes
        }
        this.removeAffix = this.removeAffix.bind(this)
    }

    removeAffix(affix) {
        this.setState(state=>{
            state.affixes = state.affixes.filter(it=>it.id!==affix.id)
            let gpes = []
            state.affixes.map(it=>gpes.push(it.code))
            CST.GPES[this.props.term] = gpes
            return state
        }, ()=>{
            store.dispatch({
                type: 'single_affix_updated'
            })
        })
    }

    render() {
        return <li className="relative hover:bg-gray-50">
            <div className='flex justify-between items-center'>
                <div className='flex'>
                    <button
                        type="button"
                        onClick={this.props.remove}
                        className="rounded-full mr-4 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                    >
                        <XCircleIcon className="h-4 w-4 text-rose-600" aria-hidden="true" />
                    </button>
                    <Link href={`/${this.props.term}/variants`}>
                        {this.props.term}
                    </Link>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <table className='min-w-full divide-y divide-gray-300'>
                <tbody className='bg-white'>
                    {this.state.affixes.map(affix => <AffixItemRead remove={()=>this.removeAffix(affix)} affix={affix} term={this.props.term} key={affix.id} />)}
                </tbody>
            </table>
        </li>
    }
}

class AffixItemRead extends Component {
    constructor(props) {
        super(props)
        const reste = this.props.term.substr(parseInt(this.props.affix.prefixReplace)).substr(0, this.props.term.length - parseInt(this.props.affix.suffixReplace))
        const result = this.props.affix.prefix + reste + this.props.affix.suffix
        this.state = {
            reste,
            result
        }
    }

    render() {
        switch (this.props.affix.type) {
            case 'PFX':
                return <tr className='even:bg-gray-50'>
                    <td>
                        <button
                            type="button"
                            onClick={this.props.remove}
                            className="rounded-full mr-4 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                        >
                            <XCircleIcon className="h-4 w-4 text-rose-600" aria-hidden="true" />
                        </button>
                    </td>
                    <td className='w-48'>
                        {this.props.affix.prefix}
                    </td>
                    <td className='w-48'>
                        {this.props.affix.prefixReplace}
                    </td>
                    <td>
                        {this.state.reste}
                    </td>
                    <td className='w-48'>

                    </td>
                    <td className='w-48'>

                    </td>
                    <th>
                        {this.state.result}
                    </th>
                </tr>
            case 'SFX':
                return <tr className='even:bg-gray-50'>
                    <td>
                        <button
                            type="button"
                            onClick={this.props.remove}
                            className="rounded-full mr-4 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                        >
                            <XCircleIcon className="h-4 w-4 text-rose-600" aria-hidden="true" />
                        </button>
                    </td>
                    <td className='w-48'>

                    </td>
                    <td className='w-48'>

                    </td>
                    <td>
                        {this.state.reste}
                    </td>
                    <td className='w-48'>
                        {this.props.affix.suffix}
                    </td>
                    <td className='w-48'>
                        {this.props.affix.suffixReplace}
                    </td>
                    <th>
                        {this.state.result}
                    </th>
                </tr>
            default:
            case 'CIRCUMFIX':
                return <tr className='even:bg-gray-50'>
                    <td>
                        <button
                            type="button"
                            onClick={this.props.remove}
                            className="rounded-full mr-4 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                        >
                            <XCircleIcon className="h-4 w-4 text-rose-600" aria-hidden="true" />
                        </button>
                    </td>
                    <td className='w-48'>
                        {this.props.affix.prefix}
                    </td>
                    <td className='w-48'>
                        {this.props.affix.prefixReplace}
                    </td>
                    <td>
                        {this.state.reste}
                    </td>
                    <td className='w-48'>
                        {this.props.affix.suffix}
                    </td>
                    <td className='w-48'>
                        {this.props.affix.suffixReplace}
                    </td>
                    <th>
                        {this.state.result}
                    </th>
                </tr>
        }
        return
    }
}

class AffixItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reste: this.props.term,
            result: this.props.term,
            affix: this.props.affix
        }
        this.applyPrefix = this.applyPrefix.bind(this)
        this.applyPrefixReplacement = this.applyPrefixReplacement.bind(this)
        this.applySuffix = this.applySuffix.bind(this)
        this.applySuffixReplacement = this.applySuffixReplacement.bind(this)
        this.applyCondition = this.applyCondition.bind(this)
        this.applySuffixCondition = this.applySuffixCondition.bind(this)
        this.compileResult = this.compileResult.bind(this)
    }

    applySuffixCondition(e) {
        const condition = e.target.value
        this.setState(state => {
            state.affix.suffix_condition = condition
            return state
        }, this.compileResult)
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

    applySuffix(e) {
        const suffix = e.target.value
        this.setState(state => {
            state.affix.suffix = suffix
            return state
        }, this.compileResult)
    }

    applySuffixReplacement(e) {
        const suffixReplace = e.target.value
        this.setState(state => {
            state.affix.suffixReplace = suffixReplace
            return state
        }, this.compileResult)
    }

    async compileResult() {
        this.setState(async state => {
            state.reste = this.props.term.substr(parseInt(state.affix.prefixReplace)).substr(0, this.props.term.length - parseInt(state.affix.suffixReplace))
            state.result = state.affix.prefix + state.reste + state.affix.suffix
            if(state.affix.type === 'CIRCUMFIX') {
                state.affix.code = await getOrSaveSymbol(this.props.affix.id, state.affix.prefix, state.affix.condition, 'PFX')
                state.affix.suffix_code = await getOrSaveSymbol(this.props.affix.id, state.affix.suffix, state.affix.suffix_condition, 'SFX')
            }
            else if (state.affix.type === 'PFX') {
                state.affix.code = await getOrSaveSymbol(this.props.affix.id, state.affix.prefix, state.affix.condition, state.affix.type)
            }
            else if (state.affix.type === 'SFX') {
                state.affix.code = await getOrSaveSymbol(this.props.affix.id, state.affix.suffix, state.affix.condition, state.affix.type)
            }
            return state
        }, () => {
            store.dispatch({
                type: 'affix_updated'
            })
        })
    }

    render() {
        switch (this.props.affix.type) {
            case 'PFX':
                return <tr className='even:bg-gray-50'>
                    <td>
                        <button
                            type="button"
                            onClick={this.props.remove}
                            className="rounded-full mr-4 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                        >
                            <XCircleIcon className="h-4 w-4 text-rose-600" aria-hidden="true" />
                        </button>
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
                </tr>
            case 'SFX':
                return <tr className='even:bg-gray-50'>
                    <td>
                        <button
                            type="button"
                            onClick={this.props.removeAffix}
                            className="rounded-full mr-4 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                        >
                            <XCircleIcon className="h-4 w-4 text-rose-600" aria-hidden="true" />
                        </button>
                    </td>
                    <td>

                    </td>
                    <td>

                    </td>
                    <td>

                    </td>
                    <td>
                        {this.state.reste}
                    </td>
                    <td>
                        <input type='text' className='form-input w-24' value={this.state.affix.condition} placeholder='[aeio]]' onChange={this.applyCondition} />
                    </td>
                    <td>
                        <input type='text' className='form-input w-24' value={this.state.affix.suffix} placeholder='Suffixe' onChange={this.applySuffix} />
                    </td>
                    <td>
                        <input type='number' className='form-input w-24' value={this.state.affix.suffixReplace} placeholder='0' onChange={this.applySuffixReplacement} />
                    </td>
                    <th>
                        {this.state.result}
                    </th>
                </tr>
            default:
            case 'CIRCUMFIX':
                return <tr className='even:bg-gray-50'>
                    <td>
                        <button
                            type="button"
                            onClick={this.props.removeAffix}
                            className="rounded-full mr-4 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                        >
                            <XCircleIcon className="h-4 w-4 text-rose-600" aria-hidden="true" />
                        </button>
                    </td>
                    <td>
                        <input type='text' className='form-input w-24' value={this.state.affix.condition} placeholder='[aeio]]' onChange={this.applyCondition} />
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
                        <input type='text' className='form-input w-24' value={this.state.affix.suffix_condition} placeholder='[aeio]]' onChange={this.applySuffixCondition} />
                    </td>
                    <td>
                        <input type='text' className='form-input w-24' value={this.state.affix.suffix} placeholder='Suffixe' onChange={this.applySuffix} />
                    </td>
                    <td>
                        <input type='number' className='form-input w-24' value={this.state.affix.suffixReplace} placeholder='0' onChange={this.applySuffixReplacement} />
                    </td>
                    <th>
                        {this.state.result}
                    </th>
                </tr>
        }
        return
    }
}

class Affixer extends Component {
    #id = 0

    constructor(props) {
        super(props)
        this.state = {
            t: 0,
            tt: 0,
            index: 0,
            regex: '',
            valid_regex: '',
            nsyllabus: 0,
            affixes: [],
            terms: this.props.terms
        }
        this.add = this.add.bind(this)
        this.applyRegex = this.applyRegex.bind(this)
        this.applySyllabus = this.applySyllabus.bind(this)
        this.remove = this.remove.bind(this)
        this.removeAffix = this.removeAffix.bind(this)
        this.paginate = this.paginate.bind(this)
    }

    paginate(f) {
        const families = this.state.terms.filter(it => (new RegExp(this.state.valid_regex)).test(it)).filter(it => this.state.nsyllabus > 0 ? (new RegExp(`^([aeio].?){${this.state.nsyllabus}}$`)).test(it) : true)
        let terms = []
        let gpes = []
        this.state.affixes.map(it=>gpes.push(it.code))
        families.map(m=>{
            terms.push({
                term: m,
                groups: (m in CST.GPES) ? CST.GPES[m] : gpes
            })
        })
        saveDic(terms)
        this.setState(state=>{
            if(f>0) {
                if(state.index<families.length-1) {
                    state.index++
                }
            }
            else {
                if(state.index>0) {
                    state.index--
                }
            }
            return state
        })
    }

    removeAffix(affix) {
        this.setState(state => {
            state.affixes = state.affixes.filter(it => it.id !== affix.id)
            return state
        })
    }

    remove(term) {
        this.setState(state => {
            state.terms = state.terms.filter(it => it !== term)
            return state
        })
    }

    add(type = 'CIRCUMFIX') {
        this.setState(state => {
            if(type==='CIRCUMFIX') {
                this.#id++
                const id = this.#id
                this.#id++
                state.affixes.push({
                    id,
                    type,
                    prefix: '',
                    prefixReplace: 0,
                    suffix: '',
                    suffixReplace: 0
                })
            }
            else {
                this.#id++
                const id = this.#id
                state.affixes.push({
                    id,
                    type,
                    prefix: '',
                    prefixReplace: 0,
                    suffix: '',
                    suffixReplace: 0
                })
            }
            return state
        })
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
        this.setState({ regex, valid_regex })
    }

    applySyllabus(e) {
        const nsyllabus = e.target.value
        this.setState({ nsyllabus })
    }

    componentDidMount() {
        store.subscribe(() => {
            const storeState = store.getState()
            if (storeState.type === 'affix_updated') {
                this.setState(state => {
                    state.t++
                    return state
                })
            }
            if (storeState.type === 'single_affix_updated') {
                let terms = []
                const families = this.state.terms.filter(it => (new RegExp(this.state.valid_regex)).test(it)).filter(it => this.state.nsyllabus > 0 ? (new RegExp(`^([aeio].?){${this.state.nsyllabus}}$`)).test(it) : true)
                let gpes = []
                this.state.affixes.map(it=>gpes.push(it.code))
                families.map(m=>{
                    terms.push({
                        term: m,
                        groups: (m in CST.GPES) ? CST.GPES[m] : gpes
                    })
                })
                saveDic(terms)
                this.setState(state => {
                    state.tt++
                    return state
                })
            }
        })
    }

    render() {
        const families = this.state.terms.filter(it => (new RegExp(this.state.valid_regex)).test(it)).filter(it => this.state.nsyllabus > 0 ? (new RegExp(`^([aeio].?){${this.state.nsyllabus}}$`)).test(it) : true)
        const m = families[this.state.index]
        let gpes = []
        this.state.affixes.map(it=>gpes.push(it.code))
        return <>
            <input type='text' className='form-input' value={this.state.regex} placeholder='regex' onChange={this.applyRegex} />
            <input type='text' className='form-input' value={this.state.syllabus} placeholder='syllabe' onChange={this.applySyllabus} />
            <button type='button' className='btn' onClick={() => this.add('PFX')}>Ajouter PFX</button>
            <button type='button' className='btn' onClick={() => this.add('SFX')}>Ajouter SFX</button>
            <button type='button' className='btn' onClick={() => this.add()}>Ajouter CIRCUMFIX</button>
            <button type='button' className='btn' onClick={() => this.regexLike}>REGEX like</button>
            <table className='min-w-full divide-y divide-gray-300 my-4'>
                <thead>
                    <tr>
                        <th></th>
                        <th colSpan={3} className='w-96'>Tovona</th>
                        <th></th>
                        <th colSpan={3} className='w-96'>Tovana</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className='bg-white'>
                    {this.state.affixes.map(affix => <AffixItem remove={() => this.removeAffix(affix)} affix={affix} term={this.props.term} key={affix.id} />)}
                </tbody>
            </table>
            <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                        type="button"
                        onClick={()=>this.paginate(-1)}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        onClick={()=>this.paginate(1)}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                </nav>
            </div>
            {this.state.valid_regex && m && <ul role="list" className="divide-y divide-gray-100 my-4">
                <Family key={`${m}-${this.state.t}`} remove={() => this.remove(m)} term={m} affixes={this.state.affixes} />
            </ul>}
            {families.map(m=><div key={`${m}-${this.state.tt}`}>{m}/{(m in CST.GPES) ? CST.GPES[m].join('') : gpes.join('')}</div>)}
            {this.state.affixes.map(affix => <AffixBlock key={affix.id} affix={affix}/>)}
        </>
    }
}

export default Affixer