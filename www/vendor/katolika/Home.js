'use client'

import React, { Component, StrictMode } from 'react';
import Modelizer from 'Core/Modelizer';
import moment from 'moment';
import trans from 'Core/translations';
import { CSSTransition } from 'react-transition-group';
import readingTime from 'reading-time/lib/reading-time';
import Prayers from 'katolika/Prayers';
import Baiboly from 'katolika/Baiboly';
import Vavaka from 'katolika/Vavaka';
import Fihirana from 'katolika/Fihirana';
import {Celebration} from './Anio';
import store from 'Core/Store';
import Nav from 'bs/Nav';
import Logo from 'Components/Partials/Nav';
import anime from 'animejs';
import Editable from 'Core/Editable';
import './Home.scss';

class KtoCarousel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            animate: false,
            minutes: readingTime(this.models('props.data.introduction'))
        }
    }

    filterSteps(it) {
        if('steps' in it)
            return it.steps.length > 0
        return it.action != 'design'
    }

    componentDidMount() {
        const carouselLectures = document.getElementById('carouselLectures')
        if (carouselLectures) {
            carouselLectures.addEventListener('slide.bs.carousel', ({ direction, relatedTarget, from, to }) => {
                this.setState(state => {
                    const data = this.models('props.data.steps', []).filter(this.filterSteps)[to]
                    state.title = trans(this.cast(data, 'label'), this.cast(data, 'label_bindings', {}))
                    if(this.cast(data, 'content', false)) {
                        state.minute = readingTime(this.cast(data, 'content'))
                    }
                    state.animate = true
                    return state
                })
            })
            carouselLectures.addEventListener('slid.bs.carousel', ({ direction, relatedTarget, from, to }) => {
                this.setState(state => {
                    state.animate = false
                    return state
                })
            })
        }
    }

    view(item) {
        switch(item.id) {
            default:
                if(item.view) {
                    switch(item.view) {
                        case 'psalm':
                            return <div className="d-flex flex-column justify-content-center">
                            <h5 className="text-center" dangerouslySetInnerHTML={{__html:this.cast(item.steps.find(it=>it.id=='chorus'), 'content')}}></h5>
                            <div className="prayer-content"><div dangerouslySetInnerHTML={{__html:item.steps.find(it=>it.id=='content').content}}></div></div>
                        </div>
                        case 'pericope':
                            return <div className="d-flex flex-column justify-content-center">
                            <h5 className="text-center">{item.steps.find(it=>it.id=='pericope_reference').content}</h5>
                            <div className="prayer-content"><div dangerouslySetInnerHTML={{__html:item.steps.find(it=>it.id=='pericope').content}}></div></div>
                        </div>
                        case 'cantique':
                            return <div className="d-flex flex-column justify-content-center">
                            <h5 className="text-center" dangerouslySetInnerHTML={{__html:this.cast(item.steps.find(it=>it.id=='chorus'), 'content')}}></h5>
                            <div className="small text-center" dangerouslySetInnerHTML={{__html:this.cast(item.steps.find(it=>it.id=='reference'), 'content')}}></div>
                            <div className="prayer-content"><div dangerouslySetInnerHTML={{__html:this.cast(item.steps.find(it=>it.id=='content'), 'content')}}></div></div>
                        </div>
                    }
                }
                return <div className="d-flex flex-column justify-content-center">
                <div className="prayer-content">
                    <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
                </div>
            </div>
            case 'today':
                return <div className="d-flex align-items-center flex-column justify-content-center">
                    {this.models('props.info.celebrations', []).filter(it=>it.rank!='férié').map((celebration, index)=><Celebration key={index} data={celebration}/>)}
                    <h5>{moment(this.cast(item.steps.find(it=>it.id=='date'), 'content')).format('dddd, D MMMM YYYY')}</h5>
                    <h6>{this.cast(item.steps.find(it=>it.id=='calendar'), 'content')}</h6>
                    <h4>{this.cast(item.steps.find(it=>it.id=='celebration'), 'content')}</h4>
                    <h6>{this.cast(item.steps.find(it=>it.id=='degre'), 'content')}</h6>
                </div>
        }
    }

    render() {
        const level = this.props.level ? this.props.level + 1 : 0
        return <div id="carouselLectures" className="carousel slide carousel-ktowhite" data-bs-interval="false" data-bs-ride="carousel">
            <div className="carousel-indicators">
                {this.models('props.data.steps', []).filter(this.filterSteps).map((item, index) => <button key={`button${item.id}-${index}`} type="button" data-bs-target={`#carouselLectures`} data-bs-slide-to={index} className={index == 0 ? 'active' : ''} aria-current="true" aria-label={item}></button>)}
            </div>
            <div className="nav-slider align-items-center d-flex d-xxl-none justify-content-between" style={{minHeight:48}}>
                <button type="button" className="btn" data-bs-target="#carouselLectures" data-bs-slide="prev">
                    <span className="bi bi-arrow-left-circle-fill" aria-hidden="true"></span>
                    <span className="visually-hidden">Précédent</span>
                </button>
                <CSSTransition in={this.state.animate} timeout={200} classNames="my-node">
                    <h5 className="m-0 text-center" style={{lineHeight:'12px'}}>{this.models('state.title', this.cast(this.models('props.data.steps', []).filter(this.filterSteps), '0.label'))}<br /><small style={{ fontSize: 10 }}>{this.models('state.minute.text', '')}</small></h5>
                </CSSTransition>
                <button type="button" className="btn" data-bs-target="#carouselLectures" data-bs-slide="next">
                    <span className="bi bi-arrow-right-circle-fill" aria-hidden="true"></span>
                    <span className="visually-hidden">Suivant</span>
                </button>
            </div>
            <div className="prayer-carousel-inner p-5">
                {this.models('props.data.steps', []).filter(this.filterSteps).map((item, index) => <div key={`step${index}`} className={`carousel-item ${index==0?'active':''}`}>
                    {this.view(item)}
                </div>)}
            </div>
            <div className="nav-slider d-flex d-xxl-none justify-content-between">
                <button type="button" className="btn" data-bs-target="#carouselLectures" data-bs-slide="prev">
                    <span className="bi bi-arrow-left-circle-fill" aria-hidden="true"></span>
                    <span className="visually-hidden">Précédent</span>
                </button>
                <button type="button" className="btn" data-bs-target="#carouselLectures" data-bs-slide="next">
                    <span className="bi bi-arrow-right-circle-fill" aria-hidden="true"></span>
                    <span className="visually-hidden">Suivant</span>
                </button>
            </div>
        </div>
    }
}

Modelizer(KtoCarousel)
class Messe extends Component {
    constructor(props) {
        super(props)
        this.state = {
            folded: true,
            animate: false,
            data : this.models('props.data')
        }
    }

    componentDidMount() {
        const carouselMesse = document.getElementById(`carouselMesse${this.props.pkey}`)
        if (carouselMesse) {
            carouselMesse.addEventListener('slide.bs.carousel', ({ direction, relatedTarget, from, to }) => {
                this.setState(state => {
                    const data = this.props.data.steps[to]
                    if(data.id=='psalm') {
                        state.title = this.cast(data, 'title')
                        state.minute = readingTime(this.cast(data.steps.find(it=>it.id=='content'), 'content'))
                    }
                    else {
                        state.title = this.cast(data.steps.find(it=>it.id=='intro'), 'content')
                        state.minute = readingTime(this.cast(data.steps.find(it=>it.id=='content'), 'content'))
                    }
                    state.animate = true
                    return state
                })
            })
            carouselMesse.addEventListener('slid.bs.carousel', ({ direction, relatedTarget, from, to }) => {
                this.setState(state => {
                    state.animate = false
                    return state
                })
            })
        }
    }

    view(data) {
        switch(data.view) {
            default:
                return <React.Fragment>
                    <h5 dangerouslySetInnerHTML={{__html:this.cast(data.steps.find(it=>it.id=='intro'), 'content')}}></h5>
                    <div className="border-bottom mb-5">{this.cast(data.steps.find(it=>it.id=='reference'), 'content')}</div>
                    <div className="prayer-content"><div dangerouslySetInnerHTML={{__html:this.cast(data.steps.find(it=>it.id=='content'), 'content')}}></div></div>
                </React.Fragment>
            case 'psalm':
                return <React.Fragment>
                <div className="border-bottom mb-5">{this.cast(data.steps.find(it=>it.id=='reference'), 'content')}</div>
                <h5 className="text-center" dangerouslySetInnerHTML={{__html:this.cast(data.steps.find(it=>it.id=='chorus'), 'content')}}></h5>
                <div className="small text-center" dangerouslySetInnerHTML={{__html:this.cast(data.steps.find(it=>it.id=='chorus_reference'), 'content')}}></div>
                <div className="prayer-content"><div dangerouslySetInnerHTML={{__html:this.cast(data.steps.find(it=>it.id=='content'), 'content')}}></div></div>
            </React.Fragment>
            case 'gospel':
                return <React.Fragment>
                <div className="border-bottom mb-5">{this.cast(data.steps.find(it=>it.id=='reference'), 'content')}</div>
                <div className="prayer-content"><div  dangerouslySetInnerHTML={{__html:this.cast(data.steps.find(it=>it.id=='content'), 'content')}}></div></div>
            </React.Fragment>
        }
    }

    render() {
        return <div>
            <div id={`carouselMesse${this.props.pkey}`} className="carousel slide carousel-ktoyellow" data-bs-interval="false" data-bs-wrap="false" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    {this.props.data.steps.map((item, index) => <button key={`button${item.type}-${index}`} type="button" data-bs-target={`#carouselMesse${this.props.pkey}`} data-bs-slide-to={index} className={index == 0 ? 'active' : ''} aria-current="true" aria-label={item.type}></button>)}
                </div>
                <div className="nav-slider align-items-center d-flex d-xxl-none justify-content-between" style={{minHeight:48}}>
                    <button type="button" className="btn" data-bs-target={`#carouselMesse${this.props.pkey}`} data-bs-slide="prev">
                        <span className="bi bi-arrow-left-circle-fill" aria-hidden="true"></span>
                        <span className="visually-hidden">Précédent</span>
                    </button>
                    <CSSTransition in={this.state.animate} timeout={200} classNames="my-node">
                        <h5 className="m-0 text-center" style={{lineHeight:'12px'}}>{this.models('state.title', this.models('props.data.steps.0.title'))}<br /><small style={{ fontSize: 10 }}>{this.models('state.minute.text', '')}</small></h5>
                    </CSSTransition>
                    <button type="button" className="btn" data-bs-target={`#carouselMesse${this.props.pkey}`} data-bs-slide="next">
                        <span className="bi bi-arrow-right-circle-fill" aria-hidden="true"></span>
                        <span className="visually-hidden">Suivant</span>
                    </button>
                </div>
                <div className="prayer-carousel-inner p-5">
                    {this.props.data.steps.map((lecture, index) => <div key={`messe${index}`} className={`carousel-item ${index==0?'active':''}`}>
                        {this.view(lecture)}
                    </div>)}
                </div>
                <div className="nav-slider d-flex d-xxl-none justify-content-between">
                    <button type="button" className="btn" data-bs-target={`#carouselMesse${this.props.pkey}`} data-bs-slide="prev">
                        <span className="bi bi-arrow-left-circle-fill" aria-hidden="true"></span>
                        <span className="visually-hidden">Précédent</span>
                    </button>
                    <button type="button" className="btn" data-bs-target={`#carouselMesse${this.props.pkey}`} data-bs-slide="next">
                        <span className="bi bi-arrow-right-circle-fill" aria-hidden="true"></span>
                        <span className="visually-hidden">Suivant</span>
                    </button>
                </div>
            </div>
        </div>
    }
}

Modelizer(Messe)

class Messes extends Component {
    render() {
        return <div id="messe" className="tab-pane fade" id="messe" role="tabpanel" aria-labelledby="messe-tab">
            <div>
                {this.models('props.data', []).map((messe, index) => <Messe key={`messe-${index}`} pkey={`messe-${index}`} data={messe} />)}
            </div>
        </div>
    }
}

Modelizer(Messes)

class Lectures extends Component {
    constructor(props) {
        super(props)
        this.state = {
            folded: true
        }
    }

    render() {
        if (!this.props.active)
            return null
        return <div id="lectures" className="tab-pane fade" role="tabpanel" aria-labelledby="lectures-tab">
            <div>
                <KtoCarousel data={this.props.data} info={this.props.info}/>
            </div>
        </div>
    }
}

Modelizer(Lectures)

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            headProgress : 0
        }
    }

    getScrollPercent() {
        var h = document.documentElement, 
            b = document.body,
            st = 'scrollTop',
            sh = 'scrollHeight';
        return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
    }

    componentDidMount() {
        var st = window.pageYOffset || document.documentElement.scrollTop; 
        this.lastScrollTop = st;
        this.mayPlay = true
        if(window.matchMedia("(min-width: 768px)").matches) {
            this.animations = {
                header: anime({
                    targets: '.header',
                    height: 100*160/document.documentElement.clientHeight,
                    duration: 400,
                    easing: 'easeInOutSine',
                    autoplay: false,
                    round: 10,
                    change:()=>{
                        this.setState({
                            headProgress: this.animations.header.progress
                        })
                    }
                })
            }
            window.addEventListener('scroll', ()=>{
                st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
                const percent = this.getScrollPercent()
                this.animations.header.seek(percent/100*this.animations.header.duration)
                this.lastScrollTop = st <= 0 ? 0 : st;
            })
            $('.nav-down').on('click', ()=>{
                if(this.state.headProgress<90) {
                    this.animations.header.play()
                    $(window).scrollTop(160)
                } 
            })
        }
        else {
            this.animations = {
                header: anime({
                    targets: '.reading-mode',
                    top: 64,
                    duration: 400,
                    easing: 'easeInOutSine',
                    autoplay: false,
                    round: 10
                })
            }
            window.addEventListener('scroll', ()=>{
                st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
                const percent = this.getScrollPercent()
                this.animations.header.seek(percent/100*this.animations.header.duration)
                this.lastScrollTop = st <= 0 ? 0 : st;
            })
            $('.nav-down').on('click', ()=>{
                st = window.pageYOffset || document.documentElement.scrollTop;
                if(st<64) {
                    this.animations.header.play()
                    $(window).scrollTop(64)
                }
            })
        }
        const now = moment()
        const retrying = ()=>{
            fetch(`/admin/event/schedule/day?dt=${now.format('YYYY-MM-DD-HH-mm-ss')}`).then(response => {
                response.json().then(data => {
                    if(data.liturgy) {
                        this.setState({data})
                        store.dispatch({
                            type : 'day_ready',
                            hour : data.liturgy.hour.title
                        })
                    }
                    else {
                        setTimeout(retrying, parseInt(data.retry.timeout)*1000)
                    }
                })
            })
        }
        retrying()
    }

    render() {
        const menumobile = [
            {
                title: trans('Login'),
                href: trans('/login'),
                icon: 'bi bi-door-open-fill'
            },
            {
                title: trans('Vavaka'),
                href: trans('/vavaka'),
                icon: 'kto kto-pray'
            },
            {
                title: trans('Baiboly'),
                href: trans('/baiboly'),
                icon: 'kto kto-bible'
            },
            {
                title: trans('Fihirana'),
                href: trans('/fihirana'),
                icon: 'kto kto-song'
            },
            {
                title: trans('Lamesa'),
                href: trans('/lamesa'),
                icon: 'kto kto-mass'
            }
        ]
        return <React.Fragment>
            <div className='header body-violet position-relative' style={{height: '100vh'}}>
                <Prayers height={this.state.headProgress} data={this.props.data}/>
                <div className='position-absolute w-100 nav-container'>
                    <nav className='bg-katolika w-100 position-absolute flex-column navbar navbar-expand-lg py-0'>
                        <Nav gotResult={()=>this.animations.header.play()} headProgress={this.state.headProgress} data={[]} hydro={$(this).data('hydro')}/>
                    </nav>
                </div>
            </div>
            <Logo/>
            <div className='d-flex flex-column justify-content-between overflow-scroll reading-mode'>
                <div className='bg-light w-100'>
                    <div className="tab-content" id="myTabContent">
                        <div id="vavaka" className="tab-pane fade show active" role="tabpanel" aria-labelledby="vavaka-tab">
                            <Vavaka/>
                        </div>
                        <div id="baiboly" className="tab-pane fade" role="tabpanel" aria-labelledby="baiboly-tab">
                            <Baiboly/>
                        </div>
                        <div id="fihirana" className="tab-pane fade" role="tabpanel" aria-labelledby="fihirana-tab">
                            <Fihirana/>
                        </div>
                        <Lectures data={this.models('state.data.liturgy.hour')} info={this.models('state.data.liturgy.info')} active={true} />
                        <Messes data={this.models('state.data.liturgy.masses', [])} />
                    </div>
                </div>
                <div className='d-none d-md-block footer w-100' style={{minHeight:120}} ref={el=>this.setEditable(el, 'foterako')}>© Control-Code.Com 2023</div>
            </div>
        </React.Fragment>
    }
}

export default Editable(Modelizer(Home))