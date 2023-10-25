'use client'

import React, { Component } from 'react'
import Link from 'next/link'
import { ChevronRightIcon, XCircleIcon, ChevronLeftIcon } from '@heroicons/react/20/solid'
import { configureStore } from '@reduxjs/toolkit'
import _ from 'lodash'

const AmDifferedState = (state = 0, action) => action;

const store = configureStore({
    reducer: AmDifferedState
});

const saveDic = async function(term) {
    console.log('sauvena', term)
    const response = await fetch('/dic', {
        method: 'POST',
        body: JSON.stringify({term})
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

class Family extends Component {
    constructor(props) {
        super(props)
        this.state = {
            affixes : this.props.affixes
        }
        this.removeAffix = this.removeAffix.bind(this)
    }

    removeAffix(affix) {
        //no duplicate
        this.props.term.nogroups = this.props.term.nogroups.filter(it=>it!=affix.code)
        this.props.term.nogroups.push(affix.code)

        let gpes = []
        let affixes = this.state.affixes
        affixes = affixes.filter(it=>it.code!==affix.code)
        affixes.map(it=>gpes.push(it.code))
        this.props.term.groups = gpes
        saveDic(this.props.term)
        this.setState({affixes}, ()=>{
            store.dispatch({
                type: 'term_groups'
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
                    <Link href={`/${this.props.term.term}/variants`}>
                        {this.props.term.term}
                    </Link>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <table className='min-w-full divide-y divide-gray-300'>
                <tbody className='bg-white'>
                    {this.state.affixes.filter(it=>it.type).map(affix => <AffixItemRead remove={()=>this.removeAffix(affix)} affix={affix} term={this.props.term.term} key={affix.code} />)}
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
        const reste = this.props.term.substr(parseInt(this.props.affix.prefixReplace)).substr(0, this.props.term.length - parseInt(this.props.affix.suffixReplace))
        const result = this.props.affix.prefix + reste + this.props.affix.suffix
        this.state = {
            reste,
            result,
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
            state.affix.suffixCondition = condition
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
            return state
        })
    }

    render() {
        switch (this.props.affix.type) {
            case 'PFX':
                return <tr className='even:bg-gray-50'>
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

                    </td>
                    <td>

                    </td>
                    <td>

                    </td>
                    <td>
                        {this.state.reste}
                    </td>
                    <td>
                        <input type='text' className='form-input w-24' value={this.state.affix.condition} placeholder='[aeio]' onChange={this.applySuffixCondition} />
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
                        <input type='text' className='form-input w-24' value={this.state.affix.suffixCondition} placeholder='[aeio]' onChange={this.applySuffixCondition} />
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
    #groups = []

    constructor(props) {
        super(props)
        this.props.affixes.map(it=>this.#groups.push(it.code))
        const terms = this.props.terms.filter(it=>_.intersection(it.groups, it.nogroups, this.#groups).length!==this.#groups.length)
        const term = terms[0]
        this.state = {
            t: 0,
            tt: 0,
            term,
            regex: '',
            valid_regex: '',
            nsyllabus: 0,
            terms
        }
        this.applyRegex = this.applyRegex.bind(this)
        this.applySyllabus = this.applySyllabus.bind(this)
        this.remove = this.remove.bind(this)
        this.paginate = this.paginate.bind(this)
    }

    paginate(f) {
        let term = this.state.term
        if(f>0) {
            saveDic(this.state.term)
            term = this.state.terms.find(it=>it.index>term.index)
        }
        else {
            term = this.state.terms.find(it=>it.index<term.index)
        }
        term.groups = this.#groups
        console.log('aon tsara io tern io', term)
        this.setState({term})
    }

    remove() {
        let tt = this.state.tt
        tt++
        this.state.term.nogroups = this.#groups
        this.state.term.groups = []
        saveDic(this.state.term)
        const term = this.state.terms.find(it=>it.index>this.state.term.index)
        this.setState({tt, term})
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
        let terms = this.state.terms.filter(it => (new RegExp(valid_regex)).test(it.term)).filter(it => this.state.nsyllabus > 0 ? (new RegExp(`^([aeio].?){${this.state.nsyllabus}}$`)).test(it.term) : true)
        this.setState({ regex, valid_regex, terms })
    }

    applySyllabus(e) {
        const nsyllabus = e.target.value
        let terms = this.state.terms.filter(it => (new RegExp(this.state.valid_regex)).test(it.term)).filter(it => nsyllabus > 0 ? (new RegExp(`^([aeio].?){${nsyllabus}}$`)).test(it.term) : true)
        this.setState({ nsyllabus, terms })
    }

    componentDidMount() {
        store.subscribe(() => {
            const storeState = store.getState()
            if (storeState.type === 'term_groups') {
                this.setState(state => {
                    state.tt++
                    return state
                })
            }
        })
    }

    render() {
        const families = this.state.terms.filter(it => it.term.length > 0 && (new RegExp(this.state.valid_regex)).test(it.term)).filter(it => this.state.nsyllabus > 0 ? (new RegExp(`^([aeio].?){${this.state.nsyllabus}}$`)).test(it.term) : true)
        return <>
            <input type='text' className='form-input' value={this.state.regex} placeholder='regex' onChange={this.applyRegex} />
            <input type='text' className='form-input' value={this.state.syllabus} placeholder='syllabe' onChange={this.applySyllabus} />
            <table className='min-w-full divide-y divide-gray-300 my-4'>
                <thead>
                    <tr>
                        <th colSpan={3} className='w-96'>Tovona</th>
                        <th></th>
                        <th colSpan={3} className='w-96'>Tovana</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className='bg-white'>
                    {this.props.affixes.map(affix => <AffixItem affix={affix} term={this.state.terms.filter(it => this.state.nsyllabus > 0 ? (new RegExp(`^([aeio].?){${this.state.nsyllabus}}$`)).test(it.term) : true).find(it=>(new RegExp(this.state.valid_regex)).test(it.term)).term} key={affix.code} />)}
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
            <ul role="list" className="divide-y divide-gray-100 my-4">
                <Family key={`${this.state.term.term}-${this.state.t}`} remove={this.remove} term={this.state.term} affixes={this.props.affixes} />
            </ul>
            {families.map(m=><div key={`${m.term}-${this.state.tt}`}>{m.term}{m.groups.length>0 && '/'}{m.groups.join('')}</div>)}
        </>
    }
}

export default Affixer