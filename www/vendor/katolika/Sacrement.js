import React, {Component} from 'react';
import trans from 'Core/translations';
import Ry from 'Core/Ry';
import store from 'Core/Store';
import Modelizer from 'Core/Modelizer';
import user from './User';
import Church from './Church';
import {Input} from './Form';
import Missionary from './Missionary';

export const SACREMENTS = [
    {
        id: 'batemy',
        name: trans('Batemy'),
        is_sacrement: true,
        has_parent: true,
        may_register: true,
        one_time: true,
        icon: 'kto-batemy',
        requires: []
    },
    {
        id: 'fampihavanana',
        name: trans('Fampihavanana'),
        has_parent: true,
        is_sacrement: true,
        may_register: true,
        icon: 'bi-heart-half',
        requires: ['batemy']
    },
    {
        id: 'kominiovoalohany',
        name: trans('Kominio voalohany'),
        is_sacrement: true,
        may_register: true,
        icon: 'kto-mass',
        requires: ['batemy', 'fampihavanana']
    },
    {
        id: 'fanavaozana',
        name: trans('Fanavaozana'),
        is_sacrement: false,
        may_register: true,
        has_parent: true,
        one_time: true,
        icon: 'kto-fanavaozana',
        requires: ['batemy']
    },
    {
        id: 'fankaherezana',
        name: trans('Fankaherezana'),
        has_parent: true,
        is_sacrement: true,
        may_register: true,
        one_time: true,
        icon: '',
        requires: ['batemy', 'fampihavanana', 'kominiovoalohany']
    },
    {
        id: 'mariazy',
        name: trans('Mariazy'),
        is_sacrement: true,
        may_register: true,
        one_time: true,
        requires: ['batemy']
    },
    {
        id: 'marary',
        name: trans('Fanosorana marary'),
        is_sacrement: true,
        requires: ['batemy']
    },
    {
        id: 'filaharana',
        name: trans('Filaharana'),
        is_sacrement: true,
        may_register: true,
        one_time: true,
        requires: ['batemy', 'fampihavanana', 'kominiovoalohany', 'fankaherezana']
    }
];

class Godchild extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            sacrements: SACREMENTS.filter(it=>(it.id in user.data.sacrements) && user.data.sacrements[it.id].status==1 && it.has_parent)
        }
    }

    componentDidMount() {
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type=='sacrement_update') {
                this.setState({
                    sacrements: SACREMENTS.filter(it=>(it.id in user.data.sacrements) && user.data.sacrements[it.id].status==1 && it.has_parent)
                })
            }
        })
    }

    render() {
        return <li className="list-group-item py-3">
            <div className='row'>
                <div className='col-lg-6'>
                    <div className="form-floating mb-3">
                        <Input type="text" name={`godchildren[${this.props.data.id}][lastname]`} className="form-control" id={`registerFloatingGodchild${this.props.data.id}Lastname`} placeholder="Rakotomalala" suggestions={{
                            row: (suggestion)=>suggestion.value,
                            value: selection=>selection.value,
                            docs: 'strings',
                            query: str=>{
                                return {
                                    value: {'$regex':RegExp(str, 'i')},
                                    tag: 'lastname'
                                }
                            }
                        }}/>
                        <label htmlFor={`registerFloatingGodchild${this.props.data.id}Lastname`}>{trans("Anarany")}</label>
                    </div>
                </div>
                <div className='col-lg-6'>
                    <div className="form-floating mb-3">
                        <Input type="text" name={`godchildren[${this.props.data.id}][firstname]`} className="form-control" id={`registerFloatingGodchild${this.props.data.id}Firstname`} placeholder="Marie" suggestions={{
                            row: (suggestion)=>suggestion.value,
                            value: selection=>selection.value,
                            docs: 'strings',
                            query: str=>{
                                return {
                                    value: {'$regex':RegExp(str, 'i')},
                                    tag: 'firstname'
                                }
                            }
                        }}/>
                        <label htmlFor={`registerFloatingGodchild${this.props.data.id}Firstname`}>{trans("Fanampin'anarany")}</label>
                    </div>
                </div>
            </div>
            <select name={`godchildren[${this.props.data.id}][sacrement]`} className="form-select">
                {this.state.sacrements.map(sacrement=><option key={`sacrament-${this.props.data.id}-${sacrement.id}`} value={sacrement.id}>{trans(sacrement.name)}</option>)}
            </select>
            <div className={`bg-light col-md-12 m-0 mt-3 py-3 row`}>
                <div className={`col-md-6`}>
                    <label className='control-label'>{trans('Daty nandraisany ny sakramenta')}</label>
                    <input type="date" className='form-control' name={`godchildren[${this.props.data.id}][date]`}/>
                </div>
                <div className={`col-md-6`}>
                    <label className='control-label'>{trans('Toerana nandraisany azy')}</label>
                    <Church name={`godchildren[${this.props.data.id}][church]`} id={`godchildren-${this.props.data.id}-church`}/>
                </div>
            </div>
            <input type="hidden" name={`godchildren[${this.props.data.id}][id]`} value={this.props.data.id}/>
        </li>
    }
}

export class Godchildren extends Component
{
    constructor(props) {
        super(props)
        this.godchild_id = Object.values(user.data.godchildren) ? Object.values(user.data.godchildren).length : 0
        this.state = {
            godchildren: this.props.data
        }
        this.addGodchild = this.addGodchild.bind(this)
    }

    addGodchild() {
        this.setState(state=>{
            this.godchild_id++
            if(!state.godchildren) {
                state.godchildren = {}
            }
            state.godchildren[this.godchild_id] = {
                id: this.godchild_id
            }
            return state
        })
    }

    render() {
        return <React.Fragment>
            <hr className='my-3' />
            <h6>{trans('Olona niantohana')}</h6>
            <div className='list-group my-3'>
                {Object.values(this.state.godchildren).map(godchild=><Godchild key={`godchildren-${godchild.id}`} data={godchild}/>)}
            </div>
            <button className='btn btn-secondary' type='button' onClick={this.addGodchild}><i className='bi bi-plus-circle-fill'></i></button>
        </React.Fragment>
    }
}

Modelizer(Godchildren)

class Sacrement extends Component
{
    constructor(props) {
        super(props)
        this.missionary_id = 1
        console.log('jdhddhd', this.props.data)
        this.state = {
            disabled: false,
            selected: this.models(`props.data.${this.props.sacrement.id}.status`, (this.props.default?this.props.default:0)),
            missionaries: Object.values(this.models(`props.data.${this.props.sacrement.id}.missionaries`, {missionary1:{id:`missionary${this.missionary_id}`}}))
        }
        this.handleChange = this.handleChange.bind(this)
        this.addMissionary = this.addMissionary.bind(this)
        this.removeMissionary = this.removeMissionary.bind(this)
        this.container = React.createRef()
    }

    componentDidMount() {
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type=='sacrement_update') {
                this.forceUpdate()
            }
        })
    }

    addMissionary() {
        this.missionary_id++
        this.setState(state=>{
            state.missionaries.push({
                id: `missionary${this.missionary_id}`
            })
            return state
        })
    }

    removeMissionary(missionary) {
        this.setState(state=>{
            state.missionaries = state.missionaries.filter(it=>it.id!=missionary.id)
            return state
        })
    }

    handleChange(e, value) {
        const selected = value
        this.setState({
            selected
        }, ()=>{
            user.update($(this.container.current).parents('form').serializeJSON()).then(()=>store.dispatch({
                type: 'sacrement_update',
                id: this.props.sacrement.id,
                selected
            }))
        })
    }   

    render() {
        if(this.state.disabled || !user.maySee(this.props.sacrement)) {
            return <Ry ref={this.container}/>
        }
        let icon
        switch(parseInt(this.state.selected)) {
            case 1:
                icon = <i className='bi bi-check-square-fill text-primary'></i>
                break
            
            case 2:
                icon = <i className='bi bi-check-square text-primary'></i>
                break

            case 3:
                icon = <i className='bi bi-square text-primary'></i>
                break

            default:
                icon = <i className='bi bi-x-square text-primary'></i>
                break
        }
        return <li ref={this.container} className="list-group-item d-flex flex-wrap align-items-baseline py-3">
            <div className='col-md-4'>{icon} {this.props.sacrement.name}</div>
            <div className='col-md-8'> 
                <div className="form-check form-check-inline">
                    <input type="radio" id={`sacrements-${this.props.sacrement.id}-status-0`} name={`sacrements[${this.props.sacrement.id}][status]`} className="form-check-input" onChange={event=>this.handleChange(event, 0)} checked={this.state.selected==0} value="0"/>
                    <label className="form-check-label" htmlFor={`sacrements-${this.props.sacrement.id}-status-0`}>{this.props.sacrement.one_time?trans('Mbola tsy vita'):trans('Mbola tsy nandray')}</label>
                </div>
            
                <div className="form-check form-check-inline">
                    <input type="radio" id={`sacrements-${this.props.sacrement.id}-status-1`} name={`sacrements[${this.props.sacrement.id}][status]`} className="form-check-input" onChange={event=>this.handleChange(event, 1)} checked={this.state.selected==1} value="1"/>
                    <label className="form-check-label" htmlFor={`sacrements-${this.props.sacrement.id}-status-1`}>{trans('Efa vita')}</label>
                </div>
            
                <div className="form-check form-check-inline">
                    <input type="radio" id={`sacrements-${this.props.sacrement.id}-status-2`} name={`sacrements[${this.props.sacrement.id}][status]`} className="form-check-input" onChange={event=>this.handleChange(event, 2)} checked={this.state.selected==2} value="2"/>
                    <label className="form-check-label" htmlFor={`sacrements-${this.props.sacrement.id}-status-2`}>{trans('Mpianatra')}</label>
                </div>
                {this.props.admin?null:<div className="form-check form-check-inline">
                    <input type="radio" id={`sacrements-${this.props.sacrement.id}-status-3`} name={`sacrements[${this.props.sacrement.id}][status]`} className="form-check-input" onChange={event=>this.handleChange(event, 3)} checked={this.state.selected==3} value="2"/>
                    <label className="form-check-label" htmlFor={`sacrements-${this.props.sacrement.id}-status-3`}>{trans('Hisoratra anarana')}</label>
                </div>}
            </div>
            {this.state.selected==1?<div className={`bg-light flex-fill p-3 mt-3`}>
                <div className='row'>
                    <div className='col'>
                         <div className={`form-group`}>
                            <label className='control-label'>{trans('Daty nandraisana ny :sakramenta', {sakramenta:this.props.sacrement.name})}</label>
                            <input type="date" className='form-control' name={`sacrements[${this.props.sacrement.id}][date]`}/>
                        </div>
                    </div>
                    <div className='col'>
                         <div className={`form-group`}>
                            <label className='control-label'>{trans('Toerana nandraisana ny :sakramenta', {sakramenta:this.props.sacrement.name})}</label>
                            <Church name={`sacrements[${this.props.sacrement.id}][church]`} id={`sacrements-${this.props.sacrement.id}-church`}/>
                        </div>
                    </div>
                    {this.props.sacrement.id==='batemy'?<React.Fragment>
                        <div className='col-md-6'>
                            <div className="form-group">
                                <label className='control-label'>{trans("Laharana")}</label>
                                <input type="text" name={`sacrements[${this.props.sacrement.id}][reference]`} className="form-control" placeholder='00000'/>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className="form-group">
                                <label className='control-label'>{trans("Anarana amin'ny batemy")}</label>
                                <Input type="text" name="bapteme_name" required className="form-control" id="registerFloatingBaptismName" placeholder="Marie" suggestions={{
                                    row: (suggestion)=>suggestion.name,
                                    value: selection=>selection.name,
                                    docs: 'saints',
                                    query: str=>{
                                        return {
                                            name: {'$regex':RegExp(str, 'i')}
                                        }
                                    }
                                }}/>
                            </div>
                        </div>
                    </React.Fragment>:null}
                </div>
               
                {this.props.sacrement.has_parent?<React.Fragment>
                    <div className='d-flex justify-content-between align-items-baseline mt-3'>
                        <h6>{trans('Mikasika ny mpiantoka')}</h6>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" name={`sacrements[${this.props.sacrement.id}][godparent][deceased]`} role="switch" id={`sacraments-${this.props.sacrement.id}-godparent-deceased`}/>
                            <label className="form-check-label" htmlFor={`sacraments-${this.props.sacrement.id}-godparent-deceased`}>{trans('Efa maty')}</label>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-lg-6'>
                            <div className="form-floating mb-3">
                                <Input type="text" name={`sacrements[${this.props.sacrement.id}][godparent][lastname]`} className="form-control" id={`registerFloatingGodparent${this.props.sacrement.id}Lastname`} placeholder="Rakotomalala" suggestions={{
                                    row: (suggestion)=>suggestion.value,
                                    value: selection=>selection.value,
                                    docs: 'strings',
                                    query: str=>{
                                        return {
                                            value: {'$regex':RegExp(str, 'i')},
                                            tag: 'lastname'
                                        }
                                    }
                                }}/>
                                <label htmlFor={`registerFloatingGodparent${this.props.sacrement.id}Lastname`}>{trans("Anaran'ny mpiantoka")}</label>
                            </div>
                        </div>
                        <div className='col-lg-6'>
                            <div className="form-floating mb-3">
                                <Input type="text" name={`sacrements[${this.props.sacrement.id}][godparent][firstname]`} className="form-control" id={`registerFloatingGodparent${this.props.sacrement.id}Firstname`} placeholder="Marie" suggestions={{
                                    row: (suggestion)=>suggestion.value,
                                    value: selection=>selection.value,
                                    docs: 'strings',
                                    query: str=>{
                                        return {
                                            value: {'$regex':RegExp(str, 'i')},
                                            tag: 'lastname'
                                        }
                                    }
                                }}/>
                                <label htmlFor={`registerFloatingGodparent${this.props.sacrement.id}Firstname`}>{trans("Fanampin'anaran'ny mpiantoka")}</label>
                            </div>
                        </div>
                    </div>
                </React.Fragment>:null}
                <hr className='my-3'/>
                <h5>{trans('Misionera')}</h5>
                {this.state.missionaries.map(missionary=><Missionary key={`missionary-${missionary.id}`} data={missionary} sacrement={this.props.sacrement.id} remove={()=>this.removeMissionary(missionary)}/>)}
                <button className='btn btn-primary' type='button' onClick={this.addMissionary}><i className='bi bi-plus'></i> {trans('misionera')}</button>
            </div>:null}
            {this.state.selected==2?<div className={`bg-light col-md-12 m-0 mt-3 py-3 row`}>
                <div className={`col-md-6`}>
                    <label className='control-label'>{trans('Daty handraisana ny :sakramenta', {sakramenta:this.props.sacrement.name})}</label>
                    <input type="date" className='form-control' name={`sacrements[${this.props.sacrement.id}][date]`}/>
                </div>
                {this.props.sacrement.has_parent?<div className={`col-md-6`}>
                    <label className='control-label'>{trans("Anarana fenon'ny mpiantoka")}</label>
                    <input type="text" className='form-control' name={`sacrements[${this.props.sacrement.id}][godparent][full_name]`}/>
                </div>:null}
            </div>:null}
            {this.state.selected==3?<div className={`bg-light col-md-12 m-0 mt-3 py-3 text-center`}>
                {trans("Téléchargeo ny formulaire ary atero eny amin'ny tompon'andraikitra akaiky anao")}
                <a className='btn btn-outline-dark btn-sm mt-2' href="" target="_blank">{trans("Téléchargeo ny formulaire")}</a>
            </div>:null}
        </li>
    }
}

export default Modelizer(Sacrement)