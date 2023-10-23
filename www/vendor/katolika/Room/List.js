import React, {Component} from 'react';
import Modelizer from 'Core/Modelizer';
import trans from 'Core/translations';
import {Input} from 'katolika/Form';
import Form from 'Core/Form';
import Swal from 'sweetalert2';

class List extends Component
{
    constructor(props) {
        super(props)
        this.newroomid = 0
        this.state = {
            data: this.models('props.data.data.data', [])
        }
        this.handleSelection = this.handleSelection.bind(this)
        this.removeUsage = this.removeUsage.bind(this)
        this.remove = this.remove.bind(this)
        this.add = this.add.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e, room, key) {
        const value = e.target.value
        this.setState(state=>{
            let _room = state.data.find(it=>it.id==room.id)
            this.descend(_room, key, value)
            return state
        })
    }

    add() {
        this.newroomid++
        this.setState(state=>{
            state.data.push({
                id: `newroom${this.newroomid}`,
                name: '',
                nsetup: {
                    seats: 0,
                    usages: []
                }
            })
            return state
        })
    }

    remove(room) {
        Swal.fire({
            title: trans('Halàna ny efitrano?'),
            text: trans('Tena esorina tsy hisy intsony ny efitrano :efitrano?', {efitrano:room.name}),
            showCancelButton: true
        }).then(result=>{
            if(result.isConfirmed) {
                this.setState(state=>{
                    let _room = state.data.find(it=>it.id==room.id)
                    _room.deleted = true
                    return state
                })
            }
        })
    }

    handleSelection(room, usage, e) {
        this.setState(state=>{
            let _room = state.data.find(it=>it.id==room.id)
            if(!_room.nsetup.usages) {
                _room.nsetup.usages = []
            }
            _room.nsetup.usages.push(usage)
            return state
        }, ()=>{
            e.val('')
        })
    }

    removeUsage(room, usage) {
        this.setState(state=>{
            let _room = state.data.find(it=>it.id==room.id)
            _room.nsetup.usages = _room.nsetup.usages.filter(it=>it!=usage)
            return state
        })
    }

    render() {
        return <Form action="/admin/rooms" method="post" id="frm_room" name="frm-room">
            <div className='modal-body'>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>{trans('Efitrano')}</th>
                            <th>{trans('Fepetra azo ampiasana azy')}</th>
                            <th>{trans("Fetr'isan-toerana")}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.filter(it=>!it.deleted).map(item => <tr key={item.id}>
                            <td>
                                <input type="text" onChange={e=>this.handleChange(e, item, 'name')} value={this.cast(item, 'name')} className="form-control" placeholder='Efitrano'/>
                            </td>
                            <td>
                                {this.cast(item, 'nsetup.usages', []).map(usage=><span key={`room-${item.id}-usage-${usage}`} className="border rounded text-nowrap">{usage} 
                                    <button className='btn' type='button' onClick={()=>this.removeUsage(item, usage)}><i className='bi bi-x-circle'></i></button>
                                </span>)}
                                <Input type="text" name={`room_usage[${item.id}]`} className="form-control" placeholder={trans('Fepetra azo ampiasana azy')} suggestions={{
                                    row: (suggestion)=>suggestion,
                                    value: selection=>selection,
                                    docs: 'room_usages',
                                    query: str=>{
                                        return {
                                            name: {'$regex':RegExp(str, 'i')}
                                        }
                                    }
                                }} onSelect={(selection, e)=>this.handleSelection(item, selection, e)}/>
                            </td>
                            <td>
                                <input type="number" className='form-control' placeholder={trans("Fetr'isan-toerana")} value={this.cast(item, 'nsetup.seats')} onChange={e=>this.handleChange(e, item, 'nsetup.seats')}/>
                            </td>
                            <td>
                                <button className='btn btn-danger' type='button' onClick={()=>this.remove(item)}><i className='bi bi-x-circle-fill'></i></button>
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
            <input type="hidden" name="adresse_id" value={this.models('props.data.data.adresse_id')}/>
            <input type="hidden" name="raw" value={JSON.stringify(this.state.data)}/>
            <div className='modal-footer justify-content-between'>
                <button className='btn btn-secondary' type='button' onClick={this.add}><i className='bi bi-plus-circle-fill'></i> {trans('Efitrano vaovao')}</button>
                <button className='btn btn-primary'>{trans('Ampiharo')}</button>
            </div>
        </Form>
    }
}

export default Modelizer(List)