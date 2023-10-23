import React, {Component} from 'react';
import trans from 'Core/translations';
import user from 'katolika/User/Model';
import { Modal } from 'bootstrap';
import {Input} from 'katolika/Form';
import mapboxgl from 'mapbox-gl';
import './Form.scss';

class Church extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            results: [],
            lat: 47.52165518370213,
            lng: -18.91091282317451
        }
        this.mapped = false
        this.container = React.createRef()
        this.fullname = React.createRef()
        this.add = this.add.bind(this)
        this.modalEl = React.createRef()
        this.submit = this.submit.bind(this)
        this.close = this.close.bind(this)
        this.mapbox = React.createRef()
        this.handleAddress = this.handleAddress.bind(this)
    }

    handleAddress(e) {
        if(!this.mapped) {
            this.mapped = true
            mapboxgl.accessToken = 'pk.eyJ1IjoiZm9sb2pvbmEiLCJhIjoiY2t6cjJ6cm00MGU2eTJvbzlldWZ6am95NyJ9.OOZ7U-FYWkgkTaDtb9QZLg';
            navigator.geolocation.getCurrentPosition(position=>{
                
            });
            const map = new mapboxgl.Map({
                container: this.mapbox.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [this.state.lat, this.state.lng],
                zoom: 13
            });
            const marker = new mapboxgl.Marker({
                draggable: true
            })
            .setLngLat([this.state.lat, this.state.lng])
            .addTo(map);
            marker.on('dragend', ()=>{
                const lngLat = marker.getLngLat();
                this.setState({
                    lat: lngLat.lat,
                    lng: lngLat.lng
                })
            });
        }
    }

    componentDidMount() {
        this.modal = new Modal(this.modalEl.current, {
            backdrop: false
        })
    }

    add() {
        this.modal.show()
    }

    async submit() {
        await user.update($(this.container.current).parents('form').serializeJSON())
        const church = await user.saveChurch(this.props.name)
        this.setState({
            church
        })
        this.close()
        this.fullname.current.val(`${church.saint.prefix} ${church.saint.name} ${church.name}`)
    }

    close() {
        this.modal.hide()
    }

    render() {
        let args = {
            id: this.props.id
        }
        if(this.props.required) {
            args.required = true
        }
        if(this.props.placeholder) {
            args.placeholder = this.props.placeholder
        }
        return <div className='position-relative select-church' ref={this.container}>
            <Input {...args} type="text" onSelect={this.props.onSelect} ref={this.fullname} className='form-control' name={`${this.props.name}[fullname]`} suggestions={{
                row: (suggestion)=><React.Fragment><strong>{trans(suggestion.saint.prefix)} {suggestion.saint.name} {suggestion.name}</strong> - Distrika <strong>{suggestion.district.name}</strong> - Diosezy <strong>{suggestion.district.diocese.name}</strong> - {suggestion.district.diocese.country.name}</React.Fragment>,
                value: selection=>`${selection.saint.prefix} ${selection.saint.name} ${selection.name}`,
                docs: 'churches',
                query: str=>{
                    return {
                        $or: [
                            {
                                'saint.name': {'$regex': RegExp(str, 'i')},
                            },
                            {
                                name: {'$regex': RegExp(str, 'i')}
                            }
                        ]
                    }
                },
                selected: selection=><input type="hidden" name={`${this.props.name}[raw]`} value={JSON.stringify(selection)}/>
            }} after={suggestions=>{
                return <button className='btn btn-secondary' type='button' onClick={this.add}><i className='bi bi-diagram-3-fill'></i></button>
            }}/>
            <div className='modal fade' ref={this.modalEl}>
                <div className={`modal-dialog modal-xl shadow`}>
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className='row'>
                                        <div className='col'>
                                            <div className="form-floating mb-3">
                                                <select className='form-select' name={`${this.props.name}[saint][prefix]`}>
                                                    <option value="Md">{trans('Masindahy')}</option>
                                                    <option value="Mb">{trans('Masimbavy')}</option>
                                                    <option value="Olts">{trans('Olontsambatra')}</option>
                                                    <option value=""></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <div className="form-floating mb-3">
                                                <Input type="text" name={`${this.props.name}[saint][name]`} className="form-control" id={`${this.props.id}-SaintName`} placeholder="Vincent de Paul" suggestions={{
                                                    row: (suggestion)=>suggestion.name,
                                                    value: selection=>selection.name,
                                                    docs: 'saints',
                                                    query: str=>{
                                                        return {
                                                            name: {'$regex':RegExp(str.replace(/^m[bd]\s/, ''), 'i')}
                                                        }
                                                    },
                                                    selected: selection=><input type="hidden" name={`${this.props.name}[saint][id]`} value={selection.id}/>
                                                }}/>
                                                <label htmlFor={`${this.props.id}-SaintName`}>{trans("Mpiaro")}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <Input onChange={this.handleAddress} type="text" name={`${this.props.name}[name]`} className="form-control" id={`${this.props.id}-name`} placeholder="Ambatonilita" suggestions={{
                                            row: (suggestion)=><React.Fragment>{suggestion.name} <strong className='text-primary'>{suggestion.code}</strong></React.Fragment>,
                                            value: selection=>selection.name,
                                            docs: 'churches',
                                            query: str=>{
                                                return {
                                                    name: {'$regex':RegExp(str, 'i')}
                                                }
                                            },
                                            selected: selection=><input type="hidden" name={`${this.props.name}[id]`} value={selection.id}/>
                                        }}/>
                                        <label htmlFor={`${this.props.id}-name`}>{trans("Toerana")}</label>
                                        <input type="hidden" name={`${this.props.name}[adresse][lat]`} value={this.state.lat}/>
                                        <input type="hidden" name={`${this.props.name}[adresse][lng]`} value={this.state.lng}/>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <Input type="text" name={`${this.props.name}[district][name]`} className="form-control" id={`${this.props.id}-district-name`} placeholder="Mahamasina" suggestions={{
                                            row: (suggestion)=><React.Fragment>{suggestion.name} <strong className='text-primary'>{suggestion.code}</strong></React.Fragment>,
                                            value: selection=>selection.name,
                                            docs: 'districts',
                                            query: str=>{
                                                return {
                                                    name: {'$regex':RegExp(str, 'i')}
                                                }
                                            },
                                            selected: selection=><input type="hidden" name={`${this.props.name}[district][id]`} value={selection.id}/>
                                        }}/>
                                        <label htmlFor={`${this.props.id}-district-name`}>{trans("Distrika")}</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <Input type="text" name={`${this.props.name}[district][diocese][name]`} className="form-control" id={`${this.props.id}-district-diocese-name`} placeholder="Antananarivo" suggestions={{
                                            row: (suggestion)=><React.Fragment>{suggestion.name} <strong className='text-primary'>{suggestion.code}</strong></React.Fragment>,
                                            value: selection=>selection.name,
                                            docs: 'dioceses',
                                            query: str=>{
                                                return {
                                                    name: {'$regex':RegExp(str, 'i')}
                                                }
                                            },
                                            selected: selection=><input type="hidden" name={`${this.props.name}[district][diocese][id]`} value={selection.id}/>
                                        }}/>
                                        <label htmlFor={`${this.props.id}-district-diocese-name`}>{trans("Diosezy")}</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <Input type="text" name={`${this.props.name}[district][diocese][country][name]`} className="form-control" id={`${this.props.id}-district-diocese-country-name`} placeholder="Madagascar" suggestions={{
                                            row: (suggestion)=><React.Fragment>{suggestion.name} <strong className='text-primary'>{suggestion.code}</strong></React.Fragment>,
                                            value: selection=>selection.name,
                                            docs: 'countries',
                                            query: str=>{
                                                return {
                                                    name: {'$regex':RegExp(str, 'i')}
                                                }
                                            },
                                            selected: selection=><input type="hidden" name={`${this.props.name}[district][diocese][country][id]`} value={selection.id}/>
                                        }}/>
                                        <label htmlFor={`${this.props.id}-district-diocese-country-name`}>{trans("Firenena")}</label>
                                    </div>
                                    <div className='d-flex justify-content-between'>
                                        <button className='btn btn-secondary' type='button' onClick={this.close}>{trans('Hidio')}</button>
                                        <button className='btn btn-primary' type='button' onClick={this.submit}>{trans('Raiketo')}</button>
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div ref={this.mapbox} style={{width:'100%',minHeight:300}}>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {this.state.church?<input type="hidden" name={`${this.props.name}[raw]`} value={JSON.stringify(this.state.church)}/>:null}
        </div>
    }
}

export default Church