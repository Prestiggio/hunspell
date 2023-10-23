import React, { Component } from 'react';
import MarkdownIt from 'markdown-it';
import { CSSTransition } from 'react-transition-group';
import readingTime from 'reading-time/lib/reading-time';
import Modelizer from 'Core/Modelizer';
import { Carousel } from 'bootstrap';
import trans from 'Core/translations';
import store from 'Core/Store';
import {INITIAL} from 'Core/Editable';

const md = new MarkdownIt()

class Model {
    constructor() {
        this.parts = []
        this.references = []
        this.abbreviations = []
    }

    getReferences() {
        return this.references
    }

    async getChapitres(livre) {
        return new Promise((resolve, reject) => {
            fetch('/books?id=' + livre.id).then(response => response.json(data => resolve(data)))
        })
    }

    async find(reference) {
        return new Promise((resolve, reject) => {
            if (!reference.livre.id && !reference.chapitre.id) {
                fetch('/books').then(response => response.json(data => resolve(data)))
            }
            else if (reference.chapitre.id) {
                fetch('/books?chapitre_id=' + reference.chapitre.id).then(response => response.json(data => resolve(data)))
            }
            else if (reference.livre.id) {
                fetch('/books?id=' + reference.livre.id).then(response => response.json(data => resolve(data)))
            }
        })
    }
}

class Part extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            content: this.props.data.content
        }
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
            if(storeState.type==='book_part' && storeState.id == this.props.data.id) {
                this.setState({
                    content: storeState.content
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

    render() {
        const editable = INITIAL.editor_mode ? {className:'editable'} : {}
        return <React.Fragment>
            <span {...editable} dangerouslySetInnerHTML={{ __html: this.state.content }}></span>
            {INITIAL.editor_mode?<a className="edit-btn" href={`#editor-dialog/admin/books/${this.props.data.id}/edit`} data-display="modal-xl"><i className="bi bi-pen"></i></a>:null}
        </React.Fragment>
    }
}

export class Andininy extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active : this.props.active
        }
        this.toggle = this.toggle.bind(this)
    }

    toggle() {
        this.setState(state=>{
            state.active = !state.active
            return state
        })
    }

    render() {
        const verse = this.props.data
        return <span onClick={this.toggle} className={this.state.active?'text-secondary':''}>
        {verse.break == 1 ? <br /> : null}
        {verse.break == 1 ? <br /> : null}
        <span className="verse_number">{verse.notation}</span>
        {verse.parts.map(part => <Part key={part.id} data={part}/>)}
    </span>
    }
}

class Baiboly extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            active_carousel: 0,
            title: '',
            current_chapter: {},
            animate: false,
            minutes: 0,
            filter: {
                children : []
            },
            chapitre: {},
            keyboard: 'livre',
            visibleKeyboard: true,
            parts: [],
            references: [],
            chapters: [],
            results: [],
            abbreviations: [],
            history: []
        }
        this.disableNextChapter = false
        this.nextChapter = this.nextChapter.bind(this)
        this.filter = this.filter.bind(this)
        this.back = this.back.bind(this)
        this.goto = this.goto.bind(this)
    }

    goto(index) {
        const carousel = Carousel.getInstance(this.carouselBaiboly)
        carousel.to(index)
    }

    back() {
        this.setState(state=>{
            state.filter = state.history.pop()
            return state
        })
    }

    filter(button) {
        if(button.level=='chapter') {
            if(this.state.chapters.indexOf(button.id)>=0) {
                const carousel = Carousel.getInstance(this.carouselBaiboly)
                carousel.to(this.state.chapters.indexOf(button.id))
                return
            }
            fetch(`/books?chapitre_id=${button.id}&id=${button.book_id}`).then(response => {
                response.json().then(data => {
                    this.setState(state => {
                        if (data.chapters.length > 0)
                            state.current_chapter = {
                                notation: data.chapters[0].notation,
                                book_id: data.chapters[0].book_id
                            }
                        state.data = state.data.concat(data.chapters)
                        state.chapters.push(data.chapters[0].id)
                        return state
                    }, () => {
                        const carousel = Carousel.getInstance(this.carouselBaiboly)
                        carousel.to(this.state.data.length-1)
                    })
                })
            })
        }
        else {
            if(button.level=='book' && button.children.length==1) {
                if(this.state.chapters.indexOf(button.children[0].id)>=0) {
                    const carousel = Carousel.getInstance(this.carouselBaiboly)
                    carousel.to(this.state.chapters.indexOf(button.children[0].id))
                    return
                }
                fetch(`/books?chapitre_id=${button.children[0].id}&id=${button.children[0].book_id}`).then(response => {
                    response.json().then(data => {
                        this.setState(state => {
                            if (data.chapters.length > 0)
                                state.current_chapter = {
                                    notation: data.chapters[0].notation,
                                    book_id: data.chapters[0].book_id
                                }
                            state.data = state.data.concat(data.chapters)
                            state.chapters.push(data.chapters[0].id)
                            return state
                        }, () => {
                            const carousel = Carousel.getInstance(this.carouselBaiboly)
                            carousel.to(this.state.data.length-1)
                        })
                    })
                })
            }
            else {
                this.setState(state=>{
                    state.history.push(state.filter)
                    state.filter = button
                    return state
                })
            }
        }
    }

    nextChapter() {
        if(this.disableNextChapter) {
            return
        }
        fetch('/books?chapitre=' + (parseInt(this.models('state.current_chapter.notation')) + 1) + '&book_id=' + this.models('state.current_chapter.book_id')).then(response => {
            response.json().then(data => {
                this.setState(state => {
                    if (data.chapters.length > 0)
                        state.current_chapter = {
                            notation: data.chapters[0].notation,
                            book_id: data.chapters[0].book_id
                        }
                    state.data = state.data.concat(data.chapters)
                    state.chapters.push(data.chapters[0].id)
                    return state
                }, () => {
                    const carousel = Carousel.getInstance(this.carouselBaiboly)
                    carousel.to(this.state.data.length-1)
                })
            })
        })
    }

    componentDidMount() {
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type=='search' && storeState.scope=='baiboly') {
                fetch(`/books?s=${storeState.data}`).then(response => {
                    response.json().then(data => {
                        this.setState(state => {
                            this.abbreviations = data.buttons
                            state.filter = {
                                children: [...this.abbreviations]
                            }
                            state.data = data.chapters
                            state.chapters.push(data.chapters[0].id)
                            state.title = `${data.chapters[0].book.subtitle}, ${data.chapters[0].notation} - ${data.chapters[0].intro}`
                            state.current_chapter = {
                                notation: data.chapters[0].notation,
                                book_id: data.chapters[0].book_id
                            }
                            state.minute = ''
                            state.animate = true
                            return state
                        })
                    })
                })
            }
            else if(storeState.type==='baiboly_results') {
                const data = storeState.data
                this.setState(state => {
                    if (data.chapters.length > 0)
                        state.current_chapter = {
                            notation: data.chapters[0].notation,
                            book_id: data.chapters[0].book_id
                        }
                    state.data = state.data.concat(data.chapters)
                    state.chapters.push(data.chapters[0].id)
                    return state
                }, () => {
                    const carousel = Carousel.getInstance(this.carouselBaiboly)
                    carousel.to(this.state.data.length-1)
                })
            }
        })
        this.carouselBaiboly = document.getElementById('carouselBaiboly')
        new Carousel(this.carouselBaiboly)
        this.carouselBaiboly.addEventListener('slide.bs.carousel', ({ direction, relatedTarget, from, to }) => {
            this.setState(state => {
                state.title = `${state.data[to].book.subtitle}, ${state.data[to].notation} - ${state.data[to].intro}`
                state.minute = readingTime('').text
                state.current_chapter = {
                    notation: state.data[to].notation,
                    book_id: state.data[to].book_id,
                }
                state.animate = true
                state.active_carousel = to
                return state
            })
        })
        this.carouselBaiboly.addEventListener('slid.bs.carousel', ({ direction, relatedTarget, from, to }) => {
            this.setState(state => {
                state.animate = false
                this.disableNextChapter = (to < state.data.length - 1)
                return state
            })
        })
        if(document.querySelector('[data-id="baiboly"]')) {
            const data = JSON.parse(document.querySelector('[data-id="baiboly"]').textContent)
            this.setState(state => {
                this.abbreviations = data.buttons
                state.filter = {
                    children: [...this.abbreviations]
                }
                state.data = data.chapters
                state.chapters.push(data.chapters[0].id)
                state.title = `${data.chapters[0].book.subtitle}, ${data.chapters[0].notation} - ${data.chapters[0].intro}`
                state.current_chapter = {
                    notation: data.chapters[0].notation,
                    book_id: data.chapters[0].book_id
                }
                state.minute = ''
                state.animate = true
                return state
            })
        }
        else {
            fetch('/books').then(response => {
                response.json().then(data => {
                    this.setState(state => {
                        this.abbreviations = data.buttons
                        state.filter = {
                            children: [...this.abbreviations]
                        }
                        state.data = data.chapters
                        state.chapters.push(data.chapters[0].id)
                        state.title = `${data.chapters[0].book.subtitle}, ${data.chapters[0].notation} - ${data.chapters[0].intro}`
                        state.current_chapter = {
                            notation: data.chapters[0].notation,
                            book_id: data.chapters[0].book_id
                        }
                        state.minute = ''
                        state.animate = true
                        return state
                    })
                })
            })
        }
    }

    truncate(content) {
        if (!content)
            return
        if (content.length < 120)
            return md.render(content)
        return md.render(content.slice(0, 120) + '...')
    }

    sort(a, b) {
        if(a.rank>b.rank)
            return 1
        else if(a.rank<b.rank)
            return -1
        return 0
    }

    render() {
        return <div className="baiboly h-100">
            <div className='row main-content mx-0 h-100'>
                <div className='col-sm-12 col-md-10 p-0 bg-white d-flex flex-column h-100'>
                    <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <div className="btn-group btn-abbr border-bottom flex-grow-1 flex-wrap" role="group" aria-label="First group">
                            {this.state.history.length>0?<button key={`back`} type="button" className={`btn flex-grow-0 fw-bold text-black-50 text-capitalize ${this.state.filter.level=='book'?(this.state.filter.testament_id==1?'abbr-primary':'abbr-secondary'):(this.state.filter.level==''?'':'')}`} onClick={this.back}><span className="bi bi-backspace-fill"></span> {this.state.filter.label}</button>:null}
                            {this.state.filter.children.filter(it=>it.level=='alpha' && /\d/.test(it.label)).map((button)=><button key={button.key} type="button" className="btn abbr-dark text-capitalize" onClick={()=>this.filter(button)}>{button.label}</button>)}
                            {this.state.filter.children.filter(it=>it.level=='alpha' && !/\d/.test(it.label)).map((button)=><button key={button.key} type="button" className="btn text-capitalize" onClick={()=>this.filter(button)}>{button.label}</button>)}
                            {this.state.filter.children.filter(it=>it.level=='book' && it.testament_id==1).sort(this.sort).map((button)=><button key={button.key} type="button" className="btn abbr-primary text-capitalize" onClick={()=>this.filter(button)}>{button.label}</button>)}
                            {this.state.filter.children.filter(it=>it.level=='book' && it.testament_id==2).sort(this.sort).map((button)=><button key={button.key} type="button" className="btn abbr-secondary text-capitalize" onClick={()=>this.filter(button)}>{button.label}</button>)}
                            {this.state.filter.children.filter(it=>it.level=='chapter').map((button)=><button key={button.key} type="button" className="btn" onClick={()=>this.filter(button)}>{button.label}</button>)}
                        </div>
                    </div>
                    <div id="carouselBaiboly" className="carousel carousel-scrollable slide carousel-secondary" data-bs-interval="false" data-bs-wrap="false" data-bs-ride="carousel">
                        <div className="carousel-indicators">
                            {this.state.data.map((item, index) => <button key={`button${item.id}`} type="button" data-bs-target={`#carouselBaiboly`} data-bs-slide-to={index} className={index == 0 ? 'active' : ''} aria-current="true" aria-label={item.title}></button>)}
                        </div>
                        <div className="align-items-center d-flex d-xxl-none justify-content-between my-3 rounded-pill">
                            <button type="button" className="btn" data-bs-target="#carouselBaiboly" data-bs-slide="prev">
                                <span className="bi bi-arrow-left-circle-fill" aria-hidden="true"></span>
                                <span className="visually-hidden">Précédent</span>
                            </button>
                            <CSSTransition in={this.state.animate} timeout={200} classNames="my-node">
                                <h5 className="m-0 text-center">{this.state.title}<br /><small style={{ fontSize: 10 }}>{this.state.minute}</small></h5>
                            </CSSTransition>
                            <button type="button" className="btn" data-bs-target="#carouselBaiboly" data-bs-slide="next" onClick={this.nextChapter}>
                                <span className="bi bi-arrow-right-circle-fill" aria-hidden="true"></span>
                                <span className="visually-hidden">Suivant</span>
                            </button>
                        </div>
                        <div className="carousel-inner col-sm-12 col-md-10 px-5 p-md-5">
                            {this.state.data.map((chapter, index) => <div key={chapter.id} id={`chapter-${chapter.id}`} className={`carousel-item ${index == 0 ? 'active' : ''}`}>
                                <div className="d-flex flex-column justify-content-center">
                                    <div className="baiboly-content">
                                        {chapter.verses.map(verse => <Andininy data={verse} key={`verse${verse.id}`}/>)}
                                    </div>
                                </div>
                            </div>)}
                        </div>
                    </div>
                </div>
                <div className="list-group bg-light d-none d-md-block col-md-2">
                    {this.state.data.map((chapter, index) => <a key={`nav${chapter.id}`} href={`#chapter-${chapter.id}`} onClick={()=>this.goto(index)} className={`list-group-item list-group-item-action list-group-item-secondary ${this.state.active_carousel==index?'active':''}`} aria-current="true">
                        <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1 text-truncate">{chapter.book.subtitle}</h5>
                        <small>{trans('Toko :n', {n:chapter.notation})}</small>
                        </div>
                        <p className="mb-1 text-truncate">{chapter.intro}</p>
                        <small>{chapter.reading_time}</small>
                    </a>)}
                </div>
            </div>
        </div>
    }
}

export default Modelizer(Baiboly);