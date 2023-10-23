import React, {Component} from 'react';
import Form from 'Core/Form';
import trans from 'Core/translations';
import {Input} from 'katolika/Form';
import Modelizer from 'Core/Modelizer';
import absoute from './images/absoute.png';
import requiem from './images/requiem.png';
import wedding from './images/wedding.png';
import batemy from './images/batemy.png';
import PictureEditor from 'Core/PictureEditor';
import Mass from './index';

export class LiturgyBuilder extends Component
{
    constructor(props) {
        super(props)
        const celebrations = this.models('props.data.liturgy.info.celebrations', [])
        celebrations.push({
            id: 'bapteme',
            title: trans('Batemy'),
            colour: 'white',
            image: {
                editable: true,
                thumbnail: {
                    url: batemy
                }
            }
        })
        celebrations.push({
            id: 'wedding',
            title: trans('Mariazy'),
            colour: 'white',
            image: {
                editable: true,
                thumbnail: {
                    url: wedding
                }
            }
        })
        celebrations.push({
            id: 'requiem',
            title: trans('Requiem'),
            colour: 'violet',
            image: {
                editable: true,
                thumbnail: {
                    url: requiem
                }
            }
        })
        celebrations.push({
            id: 'absoute',
            title: trans('Sorona masina absoute'),
            colour: 'violet',
            image: {
                editable: true,
                thumbnail: {
                    url: absoute
                }
            }
        })
        this.state = {
            massIndex: 0,
            celebrations
        }
        this.color = this.color.bind(this)
        this.getTitle = this.getTitle.bind(this)
    }

    getTitle(celebration) {
        if(celebration && celebration.id=='absoute') {
            return trans("Fanaovam-beloma an'i ...")
        }
        if(celebration && celebration.id=='requiem') {
            return trans("Fahatsiarovana an'i ...")
        }

        return trans("Lohateny")
    }

    color(c) {
        return `text-${c}`
    }

    render() {
        return <div className='card'>
            <div className='card-header'>
                <h5 className='m-0'>{trans('Fanamboarana litorjia')}</h5>
            </div>
            <div className='card-body'>
                <div className='row'>
                    {this.state.celebration?<div className='col-md-3'><PictureEditor name="thumbnail" src={this.models('state.celebration.image.thumbnail.url')}/></div>:null}
                    <div className='col'>
                        <div className="form-floating mb-3">
                            <Input type="text" name={`event[name]`} className="form-control" id={`${this.props.id}-name`} placeholder="Sorona masina" suggestions={{
                                    row: (suggestion)=><span><i className={`bi bi-circle-fill ${this.color(suggestion.colour)}`}></i> {suggestion.title}</span>,
                                    value: selection=>selection.title,
                                    docs: this.state.celebrations,
                                    query: str=>{
                                        return {
                                            name: {'$regex':RegExp(str, 'i')}
                                        }
                                    }
                                }} onSelect={celebration=>{
                                    this.setState({
                                        celebration
                                    })
                                }}/>
                            <label htmlFor={`${this.props.id}-name`}>{trans("Fankalazana")}</label>
                        </div>
                        <div className="form-floating mb-3">
                            <Input type="text" name={`event[title]`} className="form-control" id={`${this.props.id}-title`} placeholder="Fetim-piangonana" suggestions={{
                                    row: (suggestion)=><span><i className={`bi bi-circle-fill ${this.color(suggestion.colour)}`}></i> {suggestion.name}</span>,
                                    value: selection=>selection.name,
                                    docs: 'events',
                                    query: str=>{
                                        return {
                                            name: {'$regex':RegExp(str, 'i')}
                                        }
                                    }
                                }}/>
                            <label htmlFor={`${this.props.id}-title`}>{this.getTitle(this.state.celebration)}</label>
                        </div>
                        <div className="form-floating mb-3">
                            <Input type="text" name={`event[quote][body]`} className="form-control" id={`${this.props.id}-quote-body`} placeholder="Andalan-tsoratra masina" suggestions={{
                                    row: (suggestion)=><span>{suggestion.body}</span>,
                                    value: selection=>{
                                        this.setState({
                                            quote: selection
                                        })
                                        return selection.body
                                    },
                                    docs: 'quotes',
                                    query: str=>{
                                        return {
                                            body: {'$regex':RegExp(str, 'i')}
                                        }
                                    }
                                }}/>
                            <label htmlFor={`${this.props.id}-quote-body`}>{trans('Andalan-tsoratra masina')}</label>
                        </div>
                        <div className="form-floating mb-3">
                            <Input type="text" name={`event[quote][reference]`} className="form-control" id={`${this.props.id}-quote-reference`} placeholder="Toron-takila" suggestions={{
                                    row: (suggestion)=><span>{suggestion.reference}</span>,
                                    value: selection=>{
                                        this.setState({
                                            quote: selection
                                        })
                                        return selection.reference
                                    },
                                    docs: 'quotes',
                                    query: str=>{
                                        return {
                                            reference: {'$regex':RegExp(str, 'i')}
                                        }
                                    }
                                }}/>
                            <label htmlFor={`${this.props.id}-quote-body`}>{trans('Toron-takila')}</label>
                        </div>
                    </div>
                </div>
                {this.state.celebration?this.models('props.data.liturgy.masses', []).filter((it, index)=>index==this.state.massIndex).map((mass, index)=><Mass key={`mass-${index}`} data={mass} celebration={this.state.celebration} season={this.models('props.data.liturgy.info.season')}/>):null}
            </div>
            {this.props.actions?<div className='card-footer'>
                {this.props.actions}
            </div>:null}
        </div>
    }
}

Modelizer(LiturgyBuilder)

class Liturgy extends Component {
    render() {
        return <Form action="/admin/event/schedule/liturgy" method="post" name="frm_liturgy" id="frm_liturgy" >
            <LiturgyBuilder date={this.props.date} data={this.props.data} actions={
                <React.Fragment>
                    <button className='btn btn-primary'>{trans('Vakiraoka')}</button>
                    <button className='btn btn-primary'>{trans('Zarao')}</button>
                    <button className='btn btn-primary'>{trans('Avoaka DOCX')}</button>
                </React.Fragment>
            }/>
        </Form>
    }
}

export default Liturgy