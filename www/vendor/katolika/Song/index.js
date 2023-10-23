import React, {Component} from 'react';
import trans from 'Core/translations';
import {Input} from 'katolika/Form';
import KaraokeEditor from './KaraokeEditor';
import Preview from './Preview';
import Modelizer from 'Core/Modelizer';
import user from 'katolika/User/Model';

class Song extends Component
{
    static index = 0

    constructor(props) {
        super(props)
        const saved = user.getByName(this.props.data.id)
        const data = this.props.data
        if(!(typeof saved == 'string'))
            data.selection = saved
        this.state = {
            data,
            open: false
        }
        this.id = 0
        this.index = Song.index
        Song.index++
        this.handleRecite = this.handleRecite.bind(this)
        this.tsongaina = this.tsongaina.bind(this)
        this.newsong = this.newsong.bind(this)
        this.generateId = this.generateId.bind(this)
    }

    generateId() {
        this.id++
        return `${this.props.data.id}-newsong-${this.id}`
    }

    newsong() {
        this.setState(state=>{
            state.data.selection = state.noselection
            delete state.noselection
            state.detail = state.detail==='tsonga' ? false : 'tsonga'
            return state
        })
    }

    tsongaina() {
        this.setState(state=>{
            state.detail = state.detail==='tsonga' ? false : 'tsonga'
            return state
        })
    }

    handleRecite(e) {
        const checked = e.target.checked
        this.setState(state=>{
            state.data.recite=checked
            return state
        })
    }

    render() {
        const BOOKS = {
            1: {
                bg: 'bg-info',
                abbr: 'FVA'
            },
            2: {
                abbr: 'H',
                bg: 'bg-secondary'
            },
            3: {
                abbr: 'VH',
                bg: 'bg-primary'
            },
            4: {
                abbr: 'FID',
                bg: 'bg-success'
            },
            5: {
                abbr: 'AKT',
                bg: 'bg-warning'
            },
            6: {
                abbr: 'KAD',
                bg: 'bg-danger'
            },
            7: {
                abbr: 'ANT',
                bg: 'bg-ktoyellow'
            }
        }
        const required = this.models('state.data.recite') ? {} : {required:true}
        return <div>
            <div className='d-flex mb-3'>
                {this.props.required?null:<button className='btn' onClick={this.props.remove} type="button"><i className='bi bi bi-dash-square-dotted text-danger'></i></button>}
                <div className="form-floating flex-fill position-relative">
                    <input type='hidden' name={`songs[${this.index}][theme]`} value={this.props.model}/>
                    <input type='hidden' name={`songs[${this.index}][theme_title]`} value={this.props.title}/>
                    <Input {...required} key={`reload${this.props.suggestions.length}`} type="text" readOnly={this.props.data.recite} name={`songs[${this.index}][title]`} className="form-control" id={`${this.props.data.id}-name`} placeholder="Fetim-piangonana" suggestions={{
                            row: (suggestion)=><Preview data={suggestion}/>,
                            value: selection=>selection.title,
                            docs: 'songs',
                            options: this.props.suggestions,
                            query: str=>{
                                return {
                                    name: {'$regex':RegExp(str, 'i')},
                                    tags: [this.props.model]
                                }
                            }
                        }} onSelect={selection=>{
                            this.setState(state=>{
                                state.data.selection = selection
                                state.noselection = false
                                return state
                            }, ()=>{
                                user.set(this.props.data.id, {...this.state.data.selection})
                            })
                            if(selection.id) {
                                $.ajax({
                                    type: 'put',
                                    url: '/admin/song/hit',
                                    data: {
                                        id: selection.id,
                                        tag: this.props.model
                                    }
                                })
                            }
                            else{
                                this.tsongaina()
                            }
                        }} onResult={(value, result)=>{
                            this.setState(state=>{
                                if(this.cast(state.data, 'selection.title') !== value) {
                                    delete state.data.selection
                                    state.noselection = {
                                        id: this.generateId(),
                                        title: value,
                                        content: value
                                    }
                                }
                                return state
                            })
                        }}/>
                    <label htmlFor={`${this.props.data.id}-name`}>{this.props.title}</label>
                    {(!this.props.data.recite && this.state.data.selection)?<div className='position-absolute top-0' style={{right:4}}>
                        {this.state.data.selection.books?<ul className='list-inline mb-0'>{this.state.data.selection.books.map(book=><li key={`song-${this.state.data.selection.id}-book-${book.pivot.book_id}`} className={`badge ${BOOKS[book.pivot.book_id].bg} list-inline-item`}>{BOOKS[book.pivot.book_id].abbr}.{book.pivot.page}</li>)}</ul>:null}
                        <button className='btn float-end fs-4 p-0 text-primary' type='button' onClick={this.tsongaina}><i className='bi bi-cast'></i></button>
                    </div>:null}
                    {(this.state.noselection)?<div className='position-absolute top-0' style={{right:4}}>
                        <button className='btn float-end fs-4 p-0 text-primary' type='button' onClick={this.newsong}><i className='bi bi-cast'></i></button>
                    </div>:null}
                </div>
                {this.props.recitable?<div className="form-check form-switch ms-md-2">
                    <input className="form-check-input" type="checkbox" name={`songs[${this.index}][recite]`} role="switch" id={`song-${this.props.model}-${this.props.data.id}`} onChange={this.handleRecite}/>
                    <label className="form-check-label" htmlFor={`song-${this.props.model}-${this.props.data.id}`}>{trans('Tononina')}</label>
                </div>:null}
                {this.props.multiple?(this.props.isLast?<button className='btn' onClick={this.props.add} type="button"><i className='bi bi-plus-square-dotted'></i></button>:<button className='btn' onClick={this.props.remove} type="button"><i className='bi bi bi-dash-square-dotted text-danger'></i></button>):null}
            </div>
            <div className={this.state.detail==='tsonga'?'':'d-none'}>
                {this.state.data.selection?<KaraokeEditor key={this.state.data.selection.id} model={this.index} id={'content'} data={this.state.data.selection}/>:null}
            </div>
        </div>
    }
}

export default Modelizer(Song);