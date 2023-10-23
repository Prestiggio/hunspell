import React, {Component} from 'react';
import trans from 'Core/translations';
import store from 'Core/Store';
import user, {WEAPI} from 'katolika/User/Model';
import { isArray } from 'lodash';
import moment from 'moment';
import Modelizer from 'Core/Modelizer';

const SUBSCRIBE_FORM = 1;
const SUBSCRIBE_WIZARD = 2;

export const AGES = [
    {
        from: 0,
        label: trans('Zaza')
    },
    {
        from: 5,
        label: trans('Ankizy')
    },
    {
        from: 15,
        label: trans('Tanora')
    },
    {
        from: 25,
        label: trans('Olon-dehibe')
    }
]

export class Input extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value ? this.props.value : user.getByName(this.props.name),
            suggestions: this.models('props.suggestions.options', user.getByName(`sugg-${this.props.name}`, [])),
            show: false,
            n: 0,
            loading: false
        }
        this.id = Math.random()
        this.input = React.createRef()
        this.handleChange = this.handleChange.bind(this)
        this.select = this.select.bind(this)
        this.val = this.val.bind(this)
        this.handleEnter = this.handleEnter.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleEnter(e) {
        const code = (e.keyCode ? e.keyCode : e.which)
        if(code===13) {
            this.setState({
                loading: false
            })
            if(this.delay) {
                clearTimeout(this.delay)
            }
            if(this.props.onSelect) {
                this.props.onSelect.call(this, this.state.value, this)
            }
        }
    }

    val(value) {
        this.setState({
            value
        })
    }

    componentDidMount() {
        $(document).on('click', e=>{
            if(e.target!==this.input.current && this.state.show) {
                store.dispatch({
                    type: 'esc'
                })
            }
        })
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type==='esc' && this.state.show) {
                this.setState({
                    show: false,
                    loading: false
                })
            }
        })
    }

    select(e, suggestion) {
        e.preventDefault()
        const value = this.props.suggestions?this.props.suggestions.value.call(this, suggestion):suggestion
        this.setState({
            selection:suggestion,
            value,
            show:false
        }, ()=>{
            $(this.input.current).trigger('focus')
            user.set(this.props.name, value)
        })
        if(this.props.onSelect) {
            this.props.onSelect.call(this, suggestion, this)
        }
    }

    handleChange(e) {
        const value = e.target.value
        this.setState({
            value,
            loading: true
        })
        if(this.props.suggestions && value.length>2) {
            if(this.delay) {
                clearTimeout(this.delay)
            }
            
            this.delay = setTimeout(() => {
                WEAPI(api=>{
                    api.db.autocomplete(this.props.suggestions.docs, this.props.suggestions.query(value)).then(result=>{
                        this.setState(state=>{
                            if(result.docs.length>0) {
                                state.suggestions = result.docs
                                state.show = true
                                user.set(`sugg-${this.props.name}`, state.suggestions)
                            }
                            state.n = value.length
                            state.loading = false
                            return state
                        })
                        if(this.props.onResult) {
                            this.props.onResult.call(this, value, result)
                        }
                    })
                })
            }, 1000+(this.previousChange?moment().diff(this.previousChange):0));

            this.previousChange = moment()
        }
        if(this.props.onChange) {
            this.props.onChange.call(this, e)
        }
    }

    handleClick(e) {
        const value = e.target.value
        if(this.props.suggestions) {
            if(isArray(this.props.suggestions.docs)) {
                this.setState(state=>{
                    state.suggestions = this.props.suggestions.docs
                    state.show = !state.show
                    return state
                }, ()=>{
                    user.set(`sugg-${this.props.name}`, this.state.suggestions)
                    if(this.state.show) {
                        if(this.props.onResult) {
                            this.props.onResult.call(this, value, this.props.suggestions)
                        }
                    }
                })
            }
            else if(this.state.suggestions.length>0) {
                this.setState(state=>{
                    state.show = !state.show
                    return state
                }, ()=>{
                    if(this.state.show) {
                        if(this.props.onResult) {
                            this.props.onResult.call(this, value, this.props.suggestions)
                        }
                    }
                })
            }
        }
    }

    handleBlur(e) {

    }

    render() {
        const elemAttr = {...this.props}
        delete elemAttr.after
        delete elemAttr.onChange
        delete elemAttr.onSelect
        delete elemAttr.onResult
        if(this.props.after) {
            return <React.Fragment>
                <div className='input-group'>
                    <input ref={this.input} onKeyUp={this.handleEnter} {...elemAttr} value={this.state.value} onChange={this.handleChange} onClick={this.handleClick} onBlur={this.handleBlur}/>
                    {this.props.after(this.state.suggestions)}
                </div>
                <ul className={`dropdown-menu w-100 ${this.state.show?'show':''}`} data-bs-auto-close="outside" aria-labelledby="defaultDropdown">
                    {this.state.suggestions.map((suggestion, index)=><li key={`sug-${this.state.value}-${this.id}-${index}`}><a className="dropdown-item text-wrap" href="#" onClick={e=>this.select(e, suggestion)}>{this.props.suggestions?this.props.suggestions.row.call(this, suggestion):suggestion}</a></li>)}
                </ul>
                {this.state.loading?<span className='position-absolute spinner-border text-secondary' style={{top:12,right:12}}></span>:null}
                {(this.props.suggestions && this.state.selection && this.props.suggestions.selected)?this.props.suggestions.selected.call(this, this.state.selection):null}
            </React.Fragment>
        }
        return <React.Fragment>
            <input ref={this.input} onKeyUp={this.handleEnter} {...elemAttr} value={this.state.value} onChange={this.handleChange} onClick={this.handleClick} onBlur={this.handleBlur}/>
            <ul className={`dropdown-menu w-100 ${this.state.show?'show':''}`} data-bs-auto-close="outside" aria-labelledby="defaultDropdown">
                {this.state.suggestions.map((suggestion, index)=><li key={`sug-${this.state.value}-${this.id}-${index}`}><a className="dropdown-item text-wrap" href="#" onClick={e=>this.select(e, suggestion)}>{this.props.suggestions?this.props.suggestions.row.call(this, suggestion):suggestion}</a></li>)}
            </ul>
            {this.state.loading?<span className='position-absolute spinner-border text-secondary' style={{top:12,right:12}}></span>:null}
            {(this.props.suggestions && this.state.selection && this.props.suggestions.selected)?this.props.suggestions.selected.call(this, this.state.selection):null}
        </React.Fragment>
    }
}

Modelizer(Input)