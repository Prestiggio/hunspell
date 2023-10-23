import React, {Component} from 'react';
import CoreForm from 'Core/Form';
import {Input} from 'katolika/Form';
import Modelizer from 'Core/Modelizer';
import trans from 'Core/translations';
import moment from 'moment';
import 'Core/moment-mg.js';
import store from 'Core/Store';

class Form extends Component
{
    componentDidMount() {
        moment.locale($('html').attr('lang'))
    }

    color(c) {
        return `text-${c}`
    }

    render() {
        return <CoreForm action="/admin/event/schedules" method="post" name="frm_event" id="frm_event" onSuccess={response=>{
            const state = {...response}
            state.type = 'scheduled'
            store.dispatch(state)
        }}>
            <div className='modal-header'>
                <h5>{trans('Fangatahana efitrano')}</h5>
            </div>
            <div className='modal-body'>
                <div className="form-floating mb-3">
                    <Input type="text" name={`nsetup[applicant]`} className="form-control" id={`nsetup-applicant`} placeholder={trans("Amin'ny anarako manokana")} suggestions={{
                        row: (suggestion)=>suggestion,
                        value: selection=>selection,
                        docs: 'event_schedule_applicants',
                        query: str=>{
                            return {
                                name: {'$regex':RegExp(str, 'i')}
                            }
                        }
                    }}/>
                    <label htmlFor={`nsetup-applicant`}>{trans("Mpangataka")}</label>
                </div>
                <p>{trans('dia mangataka ny efitrano')} <strong className='text-primary'>{trans(this.models('props.data.room.name'))}</strong> <span dangerouslySetInnerHTML={{__html:trans("manomboka amin'ny <strong class='text-primary'>:start_at_time ny :start_at_date</strong>", {
                    start_at_time:moment(this.models('props.data.start_at', null)).format('HH:mm'),
                    start_at_date:moment(this.models('props.data.start_at', null)).format('dddd DD/MM/YYYY')
                })}}></span></p>
                <div className="form-floating mb-3">
                    <input type="datetime-local" name={`end_at`} className="form-control" id={`end_at`} defaultValue={moment(this.models('props.data.start_at', null)).add(30, 'minute').format('YYYY-MM-DD[T]HH:mm:00')} placeholder={trans("Ora ifaranana")}/>
                    <label htmlFor={`end_at`}>{trans("Ora ifaranana")}</label>
                </div>
                <div className="form-floating mb-3">
                    <Input type="text" required name={`event[name]`} className="form-control" id={`${this.props.id}-name`} placeholder="Fetim-piangonana" suggestions={{
                        row: (suggestion)=><span><i className={`bi bi-circle-fill ${this.color(suggestion.colour)}`}></i> {suggestion.title}</span>,
                        value: selection=>selection.title,
                        docs: 'events',
                        query: str=>{
                            return {
                                name: {'$regex':RegExp(str, 'i')}
                            }
                        },
                        selected: selection=><input type="hidden" name={`event[id]`} value={selection.id}/>
                    }}/>
                    <label htmlFor={`${this.props.id}-name`}>{trans("Antony")}</label>
                </div>
                <h5>{trans('Programa')}</h5>
                <div className="mb-3 d-flex flex-wrap">
                    {this.models('props.data.room.nsetup.usages', []).map(usage=><div key={usage} className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" name={`nsetup[usages][]`} id={`usage-${usage}`} value={usage}/>
                        <label className="form-check-label" htmlFor={`usage-${usage}`}>{trans(usage)}</label>
                    </div>)}
                </div>
                <div className="form-floating mb-3">
                    <input type="number" className='form-control' name="max_attendee" id="max_attendee" placeholder={trans("Isan'olona andrasana")}/>
                    <label htmlFor={`max_attendee`}>{trans("Isan'olona andrasana")}</label>
                </div>
                <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" name={`announce`} role="switch" id={`announce`}/>
                    <label className="form-check-label" htmlFor={`announce`}>{trans('Atao vaovaom-piangonana')}</label>
                </div>
            </div>
            <div className='modal-footer'>
                <input type="hidden" name="room" value={JSON.stringify(this.props.data.room)}/>
                <input type="hidden" name="start_at" value={this.props.data.start_at}/>
                <button className='btn btn-primary'>{trans('Alefa')}</button>
            </div>
        </CoreForm>
    }
}

export default Modelizer(Form)