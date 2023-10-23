import React, { Component } from 'react';
import Modelizer from 'Core/Modelizer';
import store from 'Core/Store';
import qs from 'qs';
import trans from 'Core/translations';
import 'bootstrap-datepicker';
import 'bootstrap-datepicker/js/locales/bootstrap-datepicker.fr';
import DB from './migration';
import moment from 'moment';
import {Modal} from 'bootstrap';

class Parent extends Component
{
    constructor(props) {
        super(props)
        this.input = React.createRef()
    }

    render() {
        return <div className={`input-group align-items-center ${this.props.pkey==0?'':'mt-3'}`}>
            <input ref={this.input} type="text" className="form-control" required name="parents[]" defaultValue={this.models('props.data.name')}/>
            {this.props.len > 2 ? <button className="btn btn-danger" type="button" onClick={this.props.removeParent}><i className="bi bi-x-circle-fill"></i></button> : null}
            {this.props.len < 3 ? <button className="btn btn-outline-secondary" type="button" onClick={this.props.addParent}><i className="bi bi-plus-circle-fill"></i></button> : null}
            <button className="btn btn-info top-0" type="button" onClick={()=>$(this.input.current).val(localStorage.getItem('parent'+this.props.pkey))}><i className="bi bi-arrow-counterclockwise"></i></button>
            <div className="invalid-feedback">
                {trans('Veuillez renseigner le nom complet')}
            </div>
        </div>
    }
}

Modelizer(Parent)

class Godparent extends Component
{
    constructor(props) {
        super(props)
        this.input = React.createRef()
    }

    render() {
        return <div className={`input-group align-items-center ${this.props.pkey==0?'':'mt-3'}`}>
            <input ref={this.input} type="text" required className={`form-control`} name="godparents[]" defaultValue={this.models('props.data.name')}/>
            {this.props.len > 1 ? <button className="btn btn-danger" type="button" onClick={this.props.removeGodparent}><i className="bi bi-x-circle-fill"></i></button> : null}
            {this.props.len < 2 ? <button className="btn btn-outline-secondary" type="button" onClick={this.props.addGodparent}><i className="bi bi-plus-circle-fill"></i></button> : null}
            <button className="btn btn-info top-0" type="button" onClick={()=>$(this.input.current).val(localStorage.getItem('godparent'))}><i className="bi bi-arrow-counterclockwise"></i></button>
            <div className="invalid-feedback">
                {trans('Veuillez renseigner le nom complet')}
            </div>
        </div>
    }
}

Modelizer(Godparent)

class Missionnaire extends Component
{
    constructor(props) {
        super(props)
        this.input = React.createRef()
    }

    render() {
        return <div className={`input-group align-items-center border rounded ${this.props.pkey==0?'':'mt-3'}`}>
            <input ref={this.input} name="missionnaires[]" type="text" className="form-control" placeholder={`Missionnaire ${this.props.len > 1 ? this.props.pkey + 1 : ''}`} aria-label="Missionnaire" aria-describedby="button-addon2" defaultValue={this.models('props.data.name')}/>
            {this.props.len > 1 ? <button className="btn btn-danger" type="button" onClick={this.props.removeMissionnaire}><i className="bi bi-x-circle-fill"></i></button> : null}
            {this.props.len < 3 ? <button className="btn btn-outline-secondary" type="button" onClick={this.props.addMissionnaire}><i className="bi bi-plus-circle-fill"></i></button> : null}
            <button className="btn btn-info" type="button" onClick={()=>$(this.input.current).val(localStorage.getItem('missionnaire'))}><i className="bi bi-arrow-counterclockwise"></i></button>
        </div>
    }
}

Modelizer(Missionnaire)

class Form extends Component {
    constructor(props) {
        super(props)
        this.missionnaire_id = 1
        this.godparent_id = 1
        this.missionnaire_id = 1
        this.parent_id = 2
        this.state = {
            place: this.models('props.data.place'),
            missionnaires: [{id:1}],
            godparents: [{id:1}],
            parents: [{id:1}, {id:2}],
            bapteme : {
                paroisse_id : this.models('props.paroisseId')
            }
        }
        this.addMissionnaire = this.addMissionnaire.bind(this)
        this.removeMissionnaire = this.removeMissionnaire.bind(this)
        this.bapteme_at = React.createRef()
        this.birthday = React.createRef()
        this.form = React.createRef()
        this.place = React.createRef()
        this.lastname = React.createRef()
        this.address = React.createRef()
        this.modal = React.createRef()
        this.addGodparent = this.addGodparent.bind(this)
        this.removeGodparent = this.removeGodparent.bind(this)
        this.addParent = this.addParent.bind(this)
        this.removeParent = this.removeParent.bind(this)
        this.removeBapteme = this.removeBapteme.bind(this)
        this.dialog = this.dialog.bind(this)
    }

    async removeBapteme(bapteme_id, event) {
        await DB.bapteme.delete(bapteme_id)
        event.preventDefault()
        return false;
    }

    addParent() {
        this.setState(state=>{
            if(state.parents.length<3) {
                this.parent_id++
                state.parents.push({
                    id : this.parent_id
                })
            }  
            return state
        })
    }

    removeParent(item) {
        this.setState(state=>{
            if(state.parents.length>2)
                state.parents = state.parents.filter(it=>it.id!=item.id)
            return state
        })
    }

    addGodparent() {
        this.setState(state=>{
            if(state.godparents.length<2) {
                this.godparent_id++
                state.godparents.push({
                    id : this.godparent_id
                })
            }
            return state
        })
    }

    removeGodparent(item) {
        this.setState(state=>{
            if(state.godparents.length>1)
                state.godparents = state.godparents.filter(it=>it.id!=item.id)
            return state
        })
    }

    async componentDidMount() {
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type=='add') {
                this.setState({
                    bapteme : {
                        paroisse_id : this.models('props.paroisseId')
                    },
                    missionnaires: [{id:1}],
                    godparents: [{id:1}],
                    parents: [{id:1}, {id:2}],
                }, ()=>{
                    this.form.current.classList.remove('was-validated')
                    $(this.bapteme_at.current).datepicker('setDate', '')
                    $(this.birthday.current).datepicker('setDate', '')
                    this.modal_dialog.show()
                })
            }
            else if(storeState.type=='edit') {
                let missionnaires = []
                let godparents = []
                let parents = []
                const bapteme = storeState.bapteme
                $(this.bapteme_at.current).datepicker('setDate', moment(bapteme.bapteme_at).toDate())
                $(this.birthday.current).datepicker('setDate', moment(bapteme.birthday).toDate())
                if(this.cast(bapteme, 'missionnaire1', false)) {
                    this.missionnaire_id++
                    missionnaires.push({
                        id: this.missionnaire_id,
                        name : this.cast(bapteme, 'missionnaire1')
                    })
                }
                if(this.cast(bapteme, 'missionnaire2', false)) {
                    this.missionnaire_id++
                    missionnaires.push({
                        id: this.missionnaire_id,
                        name : this.cast(bapteme, 'missionnaire2')
                    })
                }
                if(this.cast(bapteme, 'missionnaire3', false)) {
                    this.missionnaire_id++
                    missionnaires.push({
                        id: this.missionnaire_id,
                        name : this.cast(bapteme, 'missionnaire3')
                    })
                }
                bapteme.missionnaires = missionnaires
                if(this.cast(bapteme, 'parent1', false)) {
                    this.parent_id++
                    parents.push({
                        id : this.parent_id,
                        name : this.cast(bapteme, 'parent1')
                    })
                }
                if(this.cast(bapteme, 'parent2', false)) {
                    this.parent_id++
                    parents.push({
                        id : this.parent_id,
                        name : this.cast(bapteme, 'parent2')
                    })
                }
                if(this.cast(bapteme, 'parent3', false)) {
                    this.parent_id++
                    parents.push({
                        id : this.parent_id,
                        name : this.cast(bapteme, 'parent3')
                    })
                }
                if(this.cast(bapteme, 'godparent1', false)) {
                    this.godparent_id++
                    godparents.push({
                        id : this.godparent_id,
                        name : this.cast(bapteme, 'godparent1')
                    })
                }
                if(this.cast(bapteme, 'godparent2', false)) {
                    this.godparent_id++
                    godparents.push({
                        id : this.godparent_id,
                        name : this.cast(bapteme, 'godparent2')
                    })
                }
                bapteme.parents = parents
                bapteme.godparents = godparents
                this.setState({
                    bapteme,
                    missionnaires,
                    godparents,
                    parents
                }, ()=>{
                    this.modal_dialog.show()
                })
            }
        })
        this.modal_dialog = new Modal(this.modal.current)
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type=='engagement') {
                this.setState(state=>{
                    state.engaged[storeState.key] = storeState.id
                    return state
                })
            }
        })
        $(this.bapteme_at.current).datepicker({
            language : 'fr'
        })
        $(this.birthday.current).datepicker({
            language : 'fr'
        })
        $(this.form.current).on('submit', async event=>{
            event.preventDefault()
            const value = qs.parse($(this.form.current).serialize());
            if (this.form.current.checkValidity()) {
                value.bapteme_at = moment($(this.bapteme_at.current).datepicker('getDate')).format('YYYY-MM-DD')
                value.birthday = moment($(this.birthday.current).datepicker('getDate')).format('YYYY-MM-DD')
                localStorage.setItem('bapteme_at', value.bapteme_at)
                localStorage.setItem('place', value.place)
                localStorage.setItem('lastname', value.lastname)
                value.missionnaires.map(missionnaire=>{
                    if(missionnaire.name)
                        localStorage.setItem('missionnaire', missionnaire.name)
                })   
                if(value.godparents.length>0)
                    localStorage.setItem('godparent', value.godparents[0])
                value.parents.map((parent, index)=>{
                    localStorage.setItem('parent'+index, parent)
                })
                localStorage.setItem('address_raw', this.cast(value, 'address.raw'));
                value.adresse = this.cast(value, 'address.raw')
                value.missionnaire1 = this.cast(value, 'missionnaires.0', null)
                value.missionnaire2 = this.cast(value, 'missionnaires.1', null)
                value.missionnaire3 = this.cast(value, 'missionnaires.2', null)
                value.parent1 = this.cast(value, 'parents.0', null)
                value.parent2 = this.cast(value, 'parents.1', null)
                value.parent3 = this.cast(value, 'parents.2', null)
                value.godparent1 = this.cast(value, 'godparents.0', null)
                value.godparent2 = this.cast(value, 'godparents.1', null)
                value.created_at = value.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
                if(this.state.bapteme.rowid) {
                    await DB.bapteme.update(value, this.state.bapteme.rowid)
                }
                else {
                    await DB.bapteme.insert(value)
                }
                this.modal_dialog.hide()
            }
            this.form.current.classList.add('was-validated')
            return false
        })
    }

    addMissionnaire() {
        this.setState(state => {
            if (state.missionnaires.length < 3) {
                this.missionnaire_id++
                const id = this.missionnaire_id
                state.missionnaires.push({
                    id
                })
            }
            return state
        })
    }

    removeMissionnaire(missionnaire) {
        this.setState(state => {
            state.missionnaires = state.missionnaires.filter(it => it.id != missionnaire.id)
            return state
        })
    }

    dialog() {
        this.modal_dialog.show()
    }

    render() {
        return <div className="modal fade" ref={this.modal}>
                <div className="modal-dialog modal-xl">
                    <form method="get" className="needs-validation" action={`/admin/baptemes/${this.props.paroisseId}`} ref={this.form} noValidate>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5>{trans('Registre de baptême')}</h5>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="btn-group mb-3 d-flex" role="group" aria-label="Basic radio toggle button group">
                                            <input type="radio" className="btn-check" name="gender" value="M" id="btnradio1" autoComplete="off" defaultChecked={this.models('state.bapteme.gender', 'M')=='M'}/>
                                            <label className="btn btn-outline-primary" htmlFor="btnradio1">{trans('Garçon')} / {trans('Homme')} / {trans('Monsieur')}</label>
                                            <input type="radio" className="btn-check" name="gender" value="F" id="btnradio2" autoComplete="off" defaultChecked={this.models('state.bapteme.gender')=='F'}/>
                                            <label className="btn btn-outline-primary" htmlFor="btnradio2">{trans('Fille')} / {trans('Femme')} / {trans('Madame')}</label>
                                            <input type="radio" className="btn-check" name="gender" value="N/A" id="btnradio3" autoComplete="off" defaultChecked={this.models('state.bapteme.gender')=='N/A'}/>
                                            <label className="btn btn-outline-primary" htmlFor="btnradio3">{trans('Non spécifié')}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-check check-legitime my-2">
                                            <input className="form-check-input" type="checkbox" value="1" aria-label="Checkbox for following text input" id="legitime" name="legitime" defaultChecked={this.models('state.bapteme.legitime')}/>
                                            <label className="form-check-label" htmlFor="legitime">{trans('Légitime')}</label>
                                        </div>
                                    </div>
                                </div>
                                <hr className="mt-0"/>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control" required name="bapteme_name" id="bapteme_name" placeholder="Joseph" defaultValue={this.models('state.bapteme.bapteme_name')}/>
                                            <label className="control-label" htmlFor="bapteme_name">{trans('Nom de baptême')}</label>
                                            <div className="invalid-feedback">
                                                {trans('Veuillez renseigner le nom de baptême')}
                                            </div>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control" name="registration_id" placeholder="1234" defaultValue={this.models('state.bapteme.registration_id')}/>
                                            <label className="control-label" htmlFor="registration_id">{trans('Numéro')}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control" name="firstname" id="firstname" placeholder="Joseph" defaultValue={this.models('state.bapteme.firstname')}/>
                                            <label className="control-label" htmlFor="firstname">{trans('Prénom')}</label>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input ref={this.lastname} type="text" className="form-control" name="lastname" required id="lastname" placeholder="Rakoto" defaultValue={this.models('state.bapteme.lastname')}/>
                                            <label className="control-label" htmlFor="lastname">{trans('Nom de famille')}</label>
                                            <div className="invalid-feedback">
                                                {trans('Veuillez renseigner un nom')}
                                            </div>
                                            <button className="btn my-2 position-absolute text-info top-0" style={{right: 0}} type="button" onClick={()=>$(this.lastname.current).val(localStorage.getItem('lastname'))}><i className="bi bi-arrow-counterclockwise"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <hr className="mt-0"/>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-floating mb-3">
                                            <input ref={this.bapteme_at} className="form-control" required name="bapteme_at" id="bapteme_at" step="120" min="0" placeholder="13/11/2021"/>
                                            <label className="control-label" htmlFor="bapteme_at">{trans('Date du baptême')}</label>
                                            <div className="invalid-feedback">
                                                {trans('Veuillez renseigner la date du baptême')}
                                            </div>
                                            <button className="btn my-2 position-absolute text-info top-0" style={{right: 0}} type="button" onClick={()=>$(this.bapteme_at.current).datepicker('update', moment(localStorage.getItem('bapteme_at')).toDate())}><i className="bi bi-arrow-counterclockwise"></i></button> 
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input ref={this.place} type="text" className="form-control" name="place" id="place" placeholder="Mahamasina" defaultValue={this.models('state.bapteme.place')}/>
                                            <label className="control-label" htmlFor="place">{trans('Lieu du baptême (si hors paroisse)')}</label>
                                            <button className="btn my-2 position-absolute text-info top-0" style={{right: 0}} type="button" onClick={()=>$(this.place.current).val(localStorage.getItem('place'))}><i className="bi bi-arrow-counterclockwise"></i></button>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating mb-3">
                                            <input ref={this.birthday} type="text" className="form-control" required name="birthday" id="birthday" placeholder="13/11/2021"/>
                                            <label className="control-label" htmlFor="birthday">{trans('Date de naissance')}</label>
                                            <div className="invalid-feedback">
                                                {trans('Veuillez renseigner la date de naissance')}
                                            </div>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input ref={this.address} type="text" className="form-control" name="address[raw]" id="address_raw" placeholder="1, rue Saint Michel" defaultValue={this.models('state.bapteme.adresse')}/>
                                            <label className="control-label" htmlFor="address_raw">{trans('Adresse')}</label>
                                            <button className="btn my-2 position-absolute text-info top-0" style={{right: 0}} type="button" onClick={()=>$(this.address.current).val(localStorage.getItem('address_raw'))}><i className="bi bi-arrow-counterclockwise"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <hr className="mt-0"/>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="control-label">{trans('Missionnaire')}</label>
                                            {this.state.missionnaires.map((missionnaire, index) => <Missionnaire len={this.state.missionnaires.length} key={index} data={missionnaire} pkey={index} addMissionnaire={this.addMissionnaire} removeMissionnaire={()=>this.removeMissionnaire(missionnaire)}/>)}
                                        </div>
                                        <div className="form-group mb-3">
                                            <label className="control-label">{trans('Parrains/Marraines')}</label>
                                            {this.state.godparents.map((godparent, index)=><Godparent key={`godparent${godparent.id}`} pkey={index} len={this.state.godparents.length} data={godparent} addGodparent={this.addGodparent} removeGodparent={()=>this.removeGodparent(godparent)}/>)}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="control-label">{trans('Parents')}</label>
                                            {this.state.parents.map((parent, index)=><Parent key={`parent${parent.id}`} pkey={index} len={this.state.parents.length} data={parent} addParent={this.addParent} removeParent={()=>this.removeParent(parent)}/>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary btn-first-action">{trans('Enregistrer')}</button>
                                <input type="hidden" name="paroisse_id" value={this.models('state.bapteme.paroisse_id')}/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
    }
}

Modelizer(Form)

class List extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            baptemes : []
        }
        this.add = this.add.bind(this)
        this.edit = this.edit.bind(this)
    }
    
    add() {
        store.dispatch({
            type : 'add'
        })
    }

    edit(bapteme, event) {
        event.preventDefault()
        store.dispatch({
            type : 'edit',
            bapteme
        })
        return false;
    }

    async componentDidMount() {
        const baptemes = await DB.bapteme.paginate()
        this.setState({
            baptemes
        })
    }

    render() {
        return <div className="container my-4">
            <h1 className="border-bottom my-5 pb-3 text-primary border-primary">{trans('Registre de baptêmes')}</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <button className="btn btn-primary" type="button" onClick={this.add}>{trans('Nouveau')}</button>
                </div>
                <div className="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{trans('Date du bapteme')}</th>
                                <th>{trans('Nom de bapteme')}</th>
                                <th>{trans('Nom de famille')}</th>
                                <th>{trans('Date de naissance')}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.baptemes.map(bapteme=><tr key={bapteme.rowid}>
                                <td>{moment(bapteme.bapteme_at).format('DD/MM/YYYY')}</td>
                                <td>{bapteme.bapteme_name}</td>
                                <td>{bapteme.lastname}</td>
                                <td>{moment(bapteme.birthday).format('DD/MM/YYYY')}</td>
                                <td>
                                    <a onClick={e=>this.edit(bapteme, e)} href={`#edit/${bapteme.rowid}`} className="mx-3"><i className="bi bi-pencil"></i></a>
                                    <a onClick={e=>this.removeBapteme(bapteme.rowid, e)} href={`#/admin/baptemes/${bapteme.rowid}/delete`} className="mx-3"><i className="bi bi-trash"></i></a>
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
            <Form/>
        </div>
    }
}

export default Modelizer(List)