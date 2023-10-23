import React, {Component} from 'react';
import MarkdownIt from 'markdown-it';
import Modelizer from 'Core/Modelizer';
import store from 'Core/Store';
import playlist from './Playlist';
import {INITIAL} from 'Core/Editable';
import Swal from 'sweetalert2';
import trans from 'Core/translations';

const md = new MarkdownIt()

class HiraDetail extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            content: this.props.data.content,
            instrumentals: this.props.data.instrumentals
        }
        this.remove = this.remove.bind(this)
    }

    remove(instrumental) {
        Swal.fire({
            title: trans('Esorina'),
            text: trans('Tena esorina ve :title', {
                title: instrumental.title
            }),
            showCancelButton: true,
            cancelButtonText: trans('Tsia')
        }).then(response=>{
            if(response.isConfirmed) {
                $.ajax({
                    type: 'delete',
                    url: `/admin/instrumental/${instrumental.id}`,
                    success: ()=>{
                        this.setState(state=>{
                            state.instrumentals = state.instrumentals.filter(it=>it.id!=instrumental.id)
                            return state
                        })
                    }
                })
            }
            else if(response.isDismissed && response.dismiss===Swal.DismissReason.cancel) {
                this.addMember()
            }
        })
    }

    play(instrumental) {
        store.dispatch({
            type: 'playnow',
            id: instrumental.id,
            path: instrumental.path
        })
    }

    queue(instrumental) {
        playlist.append(instrumental)
    }

    reapplyDialog() {
        $('a[href^="#editor-dialog/"]').each(function () {
            let dis = $(this);
            const f = function (e) {
                e.preventDefault();
                store.dispatch({
                    type: 'dialog',
                    url: dis.attr('href').replace('#editor-dialog', ''),
                    method: 'get',
                    display: dis.data("display")
                });
                return false;
            };
            if (!this.dialogBound) {
                $(this).bind('click', f);
                this.dialogBound = true;
            }
        });
    }

    componentDidMount() {
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type==='song' && storeState.id == this.props.data.id) {
                this.setState({
                    content: storeState.content,
                    title: storeState.title
                }, ()=>{
                    if(INITIAL.editor_mode)
                        this.reapplyDialog()
                })
            }
        })
        if(INITIAL.editor_mode)
            this.reapplyDialog()
    }

    render() {
        return <div className='row detail'>
            <div className={`col-md-6 ${INITIAL.editor_mode?'editable':''}`} dangerouslySetInnerHTML={{__html:md.render(this.state.content)}}></div>
            <div className='col-md-6'>
                {INITIAL.editor_mode?<a className="edit-btn" href={`#editor-dialog/admin/songs/${this.props.data.id}/edit?field=content`} data-display="modal-xl"><i className="bi bi-music-note-beamed"></i><i className="bi bi-music-note-beamed"></i><i className="bi bi-music-note-beamed"></i></a>:null}
                {this.state.instrumentals.length>0?<div className='list-group-item'>
                    {this.state.instrumentals.map(instrumental=><div key={`instrumental-${instrumental.id}`} className='d-flex justify-content-between align-items-center'>
                        <label>{instrumental.title}</label>
                        <div>
                            <button className='btn btn-primary me-3' type="button" onClick={()=>this.play(instrumental)}><i className='bi bi-play'></i></button>
                            <button className='btn btn-ktoyellow me-3' type="button" onClick={()=>this.queue(instrumental)}><i className='bi bi-music-note-list'></i></button>
                            {INITIAL.editor_mode?<button className='btn btn-danger me-3' type="button" onClick={()=>this.remove(instrumental)}><i className='bi bi-x-octagon-fill'></i></button>:null}
                        </div>
                    </div>)}
                </div>:null}
            </div>
        </div>
    }
}

export class Hira extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            open : this.props.open,
            content : this.props.data.content,
            title : this.props.data.title,
            books : this.props.data.books
        }
        this.toggleOpen = this.toggleOpen.bind(this)
    }

    reapplyDialog() {
        $('a[href^="#editor-dialog/"]').each(function () {
            let dis = $(this);
            const f = function (e) {
                e.preventDefault();
                store.dispatch({
                    type: 'dialog',
                    url: dis.attr('href').replace('#editor-dialog', ''),
                    method: 'get',
                    display: dis.data("display")
                });
                return false;
            };
            if (!this.dialogBound) {
                $(this).bind('click', f);
                this.dialogBound = true;
            }
        });
    }

    componentDidMount() {
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type==='song' && storeState.id == this.props.data.id) {
                this.setState({
                    content: storeState.content,
                    title: storeState.title
                }, ()=>{
                    if(INITIAL.editor_mode)
                        this.reapplyDialog()
                })
                store.dispatch({
                    type: 'dialog.dismiss'
                })
            }
            if(storeState.type==='page' && storeState.song_id == this.props.data.id) {
                this.setState(state=>{
                    const book = state.books.find(it=>it.pivot.book_id==storeState.book_id)
                    book.pivot.page = storeState.page
                    return state
                }, ()=>{
                    if(INITIAL.editor_mode)
                        this.reapplyDialog()
                })
                store.dispatch({
                    type: 'dialog.dismiss'
                })
            }
        })
        if(INITIAL.editor_mode)
            this.reapplyDialog()
    }

    toggleOpen() {
        this.setState(state=>{
            state.open = !this.props.open ? !state.open : true
            return state
        })
    }

    truncate(content) {
        if (!content)
            return
        if (content.length < 40)
            return md.render(content)
        return md.render(content.slice(0, 40) + '...')
    }

    render() {
        //console.log('iisiid', this.props.data.id, this.props.data.books)
        return <div className={`hira ${this.state.open?'open':''}`}>
            <h5 className={`mb-0 text-secondary ${this.props.open?'border-bottom pb-3 mb-3':''} mouse-pointable`} onClick={this.toggleOpen}>{this.state.title}{INITIAL.editor_mode?<a className="edit-btn" href={`#editor-dialog/admin/songs/${this.props.data.id}/edit?field=title`} data-display="modal-xl"><i className="bi bi-pen"></i></a>:null}<br/>
            {this.state.books.map(book=><small key={`songresult${this.props.data.id}-book${book.pivot.book_id}`} className='text-muted me-2 fs-6'><i className='bi bi-book'></i> {book.title} Tak.{book.pivot.page}{INITIAL.editor_mode?<a className="edit-btn" href={`#editor-dialog/admin/songs/${this.props.data.id}/page?id=${book.pivot.id}`} data-display="modal-xl"><i className="bi bi-pen"></i></a>:null}</small>)}</h5>     
            <div className='recap' dangerouslySetInnerHTML={{__html:this.truncate(this.state.content)}}></div>
            <HiraDetail data={this.props.data}/>
        </div>
    }
}

class Fihirana extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            term: '',
            results: []
        }
    }

    componentDidMount() {
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type=='search' && storeState.scope=='fihirana') {
                if (this.submitController) {
                    this.submitController.abort()
                }
                this.submitController = new AbortController()
                fetch('/songs?s=' + storeState.data, {
                    signal: this.submitController.signal
                }).then(response => {
                    response.json().then(data => {
                        this.setState(state => {
                            state.term = storeState.data,
                            state.results = data.results
                            return state
                        })
                    })
                }).catch(e=>{

                })
            }
            else if(storeState.type==='fihirana_results') {
                this.setState(state => {
                    state.results = storeState.data
                    return state
                })
            }
        })
        if(document.querySelector('[data-id="fihirana"]')) {
            const data = JSON.parse(document.querySelector('[data-id="fihirana"]').textContent)
            this.setState(state => {
                state.results = data.results
                return state
            })
        }
        else {
            fetch('/songs').then(response => {
                response.json().then(data => {
                    this.setState(state => {
                        state.results = data.results
                        return state
                    })
                })
            }).catch(e=>{
                
            })
        }
    }

    render() {
        return <div className='container-fluid bg-white'>
            <ul className='list list-unstyled py-3'>
                {this.state.results.map(result=><li key={`songresult${result.id}`} className='pb-3'>
                    <Hira data={result} open={this.state.results.length==1}/>
                </li>)}
            </ul>
        </div>
    }
}

export default Modelizer(Fihirana)