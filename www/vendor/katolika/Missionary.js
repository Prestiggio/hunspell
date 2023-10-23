import React, {Component} from 'react';
import trans from 'Core/translations';
import {Input} from './Form';

class Missionary extends Component
{
    constructor(props) {
        super(props)
        this.group = React.createRef()
        this.state = {
            data : {

            }
        }
    }

    componentDidMount() {
        $(this.group.current).find('[name]').on('change', (e, l)=>{
            const name = $(e.target).attr('name').match(/(\w+)\]$/)[1]
            const value = e.target.value
            this.setState(state=>{
                state.data[name] = value
                return state
            })
        })
    }

    render() {
        return <div className='border-top' ref={this.group}>
            <div className='row mt-3'>
                <div className='col-lg-6'>
                    <div className="form-floating mb-3">
                        <Input type="text" name={`sacrements[${this.props.sacrement}][missionaries][${this.props.data.id}][lastname]`} className="form-control" id={`sacrements-${this.props.sacrement}-missionary-${this.props.data.id}-lastname`} placeholder="Rakotomalala" suggestions={{
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
                        <label htmlFor={`sacrements-${this.props.sacrement}-missionary-${this.props.data.id}-lastname`}>{trans("Anarany")}</label>
                    </div>
                </div>
                <div className='col-lg-6'>
                    <div className="form-floating mb-3">
                        <Input type="text" name={`sacrements[${this.props.sacrement}][missionaries][${this.props.data.id}][firstname]`} className="form-control" id={`sacrements-${this.props.sacrement}-missionary-${this.props.data.id}-firstname`} placeholder="Marie" suggestions={{
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
                        <label htmlFor={`sacrements-${this.props.sacrement}-missionary-${this.props.data.id}-firstname`}>{trans("Fanampin'anarany")}</label>
                    </div>
                </div>
                <div className='col-lg-6'>
                    <div className="form-floating flex-fill mb-3">
                        <Input type="text" name={`sacrements[${this.props.sacrement}][missionaries][${this.props.data.id}][title]`} className="form-control" id={`sacrements-${this.props.sacrement}-missionary-${this.props.data.id}-title`} placeholder="Monseniera, Mompera, Frera, Doktera, Mompera kiore, Mompera vikera, Olon-tsotra..." suggestions={{
                            row: (suggestion)=>suggestion.value,
                            value: selection=>selection.value,
                            docs: 'strings',
                            query: str=>{
                                return {
                                    value: {'$regex':RegExp(str, 'i')},
                                    tag: 'title'
                                }
                            }
                        }}/>
                        <label htmlFor={`sacrements-${this.props.sacrement}-missionary-${this.props.data.id}-title`}>{trans("Andraikiny")}</label>
                    </div>
                </div>
                <div className='align-items-center col-lg-6 d-flex flex-row justify-content-between'>
                    <div className="form-check form-switch me-3">
                        <input className="form-check-input" type="checkbox" name={`sacrements[${this.props.sacrement}][missionaries][${this.props.data.id}][deceased]`} role="switch" id={`sacrements-${this.props.sacrement}-missionary-${this.props.data.id}-deceased`}/>
                        <label className="form-check-label" htmlFor={`sacrements-${this.props.sacrement}-missionary-${this.props.data.id}-deceased`}>{trans('Efa maty')}</label>
                    </div>
                    <button className='btn btn-danger' type='button' onClick={this.props.remove}><i className='bi bi-trash'></i></button>
                </div>
                <input type="hidden" name={`sacrements[${this.props.sacrement}][missionaries][${this.props.data.id}][id]`} value={this.props.data.id}/>
            </div>
        </div>
    }
}

export default Missionary;