import React, { Component } from 'react';
import trans from 'Core/translations';
import Modelizer from 'Core/Modelizer';
import Form from 'Core/Form';
import './Checklist.scss';
import Church from 'katolika/Church/Form';
import Room from 'findrafindra/Room';
import moment from 'moment';
import {LiturgyBuilder} from './Liturgy';
import store from 'Core/Store';

class Checklist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date: moment(),
            t: moment(),
            rooms: [],
            scheduled: false,
            liturgy: this.props.data.liturgy,
            free: true
        }
        this.handleChurchChange = this.handleChurchChange.bind(this)
        this.handleRoomChange = this.handleRoomChange.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.updateRoom = this.updateRoom.bind(this)
        this.handleFree = this.handleFree.bind(this)
    }

    componentDidMount() {
        if(this.props.data.church_id) {
            $.ajax({
                url: `/admin/churches/${this.props.data.church_id}`,
                success: response=>{
                    this.handleChurchChange(response)
                }
            })
        }
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type==='scheduled') {
                this.setState(state=>{
                    state.scheduled = {
                        id: storeState.id,
                        start_at: storeState.start_at
                    }
                    state.liturgy = storeState.liturgy
                    return state
                })
            }
        })
    }

    handleFree(e) {
        this.setState({
            free: e.target.checked
        })
    }

    handleChurchChange(church) {
        this.setState(state=>{
            state.church_id = church.id
            state.rooms = church.rooms
            state.room = church.rooms.length>0?church.rooms[0]:null
            state.t = state.date.clone() 
            state.liturgy = church.liturgy
            state.scheduled = false
            return state
        })
    }

    handleRoomChange(e) {
        const room_id = e.target.value
        this.setState({
            room: this.state.rooms.find(it=>it.id==room_id),
            scheduled: false
        })
    }

    handleDateChange(e) {
        const date = moment(e.target.value)
        this.setState({
            date,
            rooms: [],
            room: null,
            t: moment()
        }, this.updateRoom)
    }

    updateRoom() {
        $.ajax({
            url: `/admin/churches/${this.state.church_id}`,
            data: {
                date: this.state.date.format('YYYY-MM-DD')
            },
            success: response=>{
                this.handleChurchChange(response)
            }
        })
    }

    render() {
        return <React.Fragment>
            <Form name="frm_mass" action="/mass" id="frm_mass" method="post" onSuccess={data=>{
            document.location.href = data.download_url
        }}>
                <div className='row'>
                    {this.props.data.church_id?null:<div className={`col-md-3`}>
                        <label className='control-label'>{trans('Toerana')}</label>
                        <Church name={`church`} id={`church`} placeholder="&#xF52A; Toerana" onSelect={this.handleChurchChange}/>
                    </div>}
                    {this.state.room?<div className='col-md-3'>
                        <label className='control-label'>{this.state.rooms.filter(it=>it.schedules.length==0).length>0?trans('Efitrano :n tsy miasa', {n:this.state.rooms.filter(it=>it.schedules.length==0).length}):trans('Tsy misy efitrano intsony')}</label>
                        <select className='form-select' name='room_id' onChange={this.handleRoomChange} value={this.models('state.room.id', '')}>
                            {this.state.rooms.map(room=><option value={room.id} key={`select-room-${room.id}`}>{room.name}</option>)}
                        </select>
                    </div>:null}
                    <div className={`col-md-3`}>
                        <label className='control-label'>{trans('Andro')}</label>
                        <div className='input-group'>
                            <input type="date" className='form-control' name={`date`} min={moment().format('YYYY-MM-DD')} value={this.state.date.format('YYYY-MM-DD')} onChange={this.handleDateChange}/>
                        </div>
                    </div>
                    {this.state.scheduled?<div className='col-md-3 align-self-end'>
                        {trans('Miandry valiny')} :
                        <h4 className='text-secondary'>{trans("Manomboka amin'ny :start_at", {start_at:moment(this.state.scheduled.start_at).format('HH:mm')})}</h4>
                    </div>:null}
                </div>
                <div className='d-flex my-3'>
                    {this.state.room?<Room key={`room-${this.state.room.id}-date-${this.state.t.format('YYYY-MM-DD[T]HH-mm-ss')}`} date={this.state.date} data={this.state.room} startHour={5} endHour={18}/>:null}
                </div>
                {this.state.scheduled?<React.Fragment>
                    <LiturgyBuilder key={`liturgy-${this.state.liturgy.id}`} data={{liturgy:this.state.liturgy}}/>
                    <input type='hidden' name='schedule' value={JSON.stringify(this.state.scheduled)}/>
                    <input type="hidden" name='future' value={this.props.data.future}/>
                    <div className="form-check form-switch ms-md-2">
                        <input className="form-check-input" type="checkbox" name={`free`} role="switch" id={`free`} onChange={this.handleFree} defaultChecked={this.state.free===true} value={true}/>
                        <label className="form-check-label" htmlFor={`free`}>{this.state.free?trans('Zaraina maimaimpoana'):trans('Amidy')}</label>
                    </div>
                    <div className='btn-group'>
                        <button className='btn btn-secondary my-3'>{trans('Téléchargeo ny tononkira')}</button>
                        <button className='btn btn-secondary my-3' disabled>{trans('Handefa fangatahana')}</button>
                    </div>
                </React.Fragment>:null}
            </Form>
            {this.state.scheduled?<Form name="frm_stylized" action="/admin/event/schedule/remass" id="frm_stylized" method="post">
                <input type='hidden' name='schedule' value={JSON.stringify(this.state.scheduled)}/>
                <input type="hidden" name='future' value={this.props.data.future}/>
                <input type="file" name="stylized" id="stylized" className="d-none"/>
                <label htmlFor="stylized" className="btn btn-ktoyellow me-3">
                    {trans('Tononkira natsaraina...')}
                </label>
                <button className='btn btn-secondary my-3'>{trans('Alefa')}</button>
            </Form>:null}
        </React.Fragment>
    }
}

export default Modelizer(Checklist)