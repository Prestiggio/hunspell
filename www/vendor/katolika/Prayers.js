import React, { Component } from 'react';
import Modelizer from 'Core/Modelizer';
import MarkdownIt from 'markdown-it';
import { CSSTransition } from 'react-transition-group';
import readingTime from 'reading-time/lib/reading-time';
import trans from 'Core/translations';
import fifonana from 'medias/fifonana.svg';
import fitsaohana from 'medias/JPII-monstrance.png';
import fisaorana from 'medias/fisaorana.png';
import mangataka from 'medias/mangataka.svg';
import Masonry from 'masonry-layout';
import mapboxgl from 'mapbox-gl';
import Karaoke from './Karaoke';

const md = new MarkdownIt()

const truncate = (content, length=40)=>{
    if (!content)
        return
    if (content.length < length)
        return md.render(content)
    return md.render(content.slice(0, length) + '...')
}
class Actions extends Component
{
    render() {
        const tos = [
            {
                id: 'myself',
                title: trans('Ho ahy')
            },
            {
                id: 'best',
                title: trans("Ho an'ilay olon-tiako")
            },
            {
                id: 'dad',
                title: trans("Ho an'ny raiko")
            },
            {
                id: 'mom',
                title: trans("Ho an'ny reniko")
            },
            {
                id: 'elder',
                title: trans("Ho an'ny zokiko")
            },
            {
                id: 'younger',
                title: trans("Ho an'ny zandriko")
            },
            {
                id: 'friend',
                title: trans("Ho an'ny namako")
            },
            {
                id: 'onegood',
                title: trans("Ho an'olona iray nanao soa ahy")
            },
            {
                id: 'onebad',
                title: trans("Ho an'olona iray nanao ratsy ahy")
            },
        ]
        return <div>
            <div className='list-group'>
                {tos.map(to=><button key={to.id} className='list-group-item list-group-item-action'>{to.title}</button>)}
            </div>
        </div>
    }
}
export class Vavaka extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            open : this.props.open
        }
        this.toggleOpen = this.toggleOpen.bind(this)
    }

    toggleOpen() {
        this.setState(state=>{
            state.open = !state.open
            return state
        })
    }

    render() {
        //console.log('iisiid', this.props.data.id, this.props.data.books)
        return <div className={`hira row ${this.state.open?'open':''}`}>
            <div className='col-md-6'>
                <h5 className='mb-0 text-secondary mouse-pointable' onClick={this.toggleOpen}>{this.props.data.title}</h5>     
                <div className='recap' dangerouslySetInnerHTML={{__html:truncate(this.props.data.content, 40)}}></div>
                <div className='detail' dangerouslySetInnerHTML={{__html:md.render(this.props.data.content)}}></div>
            </div>
            <div className='col-md-6 actions'>
                <Actions/>
            </div>
        </div>
    }
}

class Prayers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            feed: [],
            title: '',
            animate : false,
            minutes : 0,
            current : ''
        }
        this.map = React.createRef()
        this.handleSearch = this.handleSearch.bind(this)
        this.buildCarousel = this.buildCarousel.bind(this)
        this.fifonana = this.fifonana.bind(this)
        this.fitsaohana = this.fitsaohana.bind(this)
        this.fisaorana = this.fisaorana.bind(this)
        this.fangatahana = this.fangatahana.bind(this)
    }

    fifonana() {
        document.querySelector('body').classList.add('mifantoka-fifonana')
    }

    fitsaohana() {
        document.querySelector('body').classList.add('mifantoka-fitsaohana')
    }

    fisaorana() {
        document.querySelector('body').classList.add('mifantoka-fisaorana')
    }

    fangatahana() {
        document.querySelector('body').classList.add('mifantoka-fangatahana')
    }

    handleSearch(event) {
        if (this.submitController) {
            this.submitController.abort()
        }
        this.submitController = new AbortController()
        const value = event.target.value
        fetch('/prayers?s=' + value, {
            signal: this.submitController.signal
        }).then(response => {
            response.json().then(data => {
                this.setState(state => {
                    state.data = data.data
                    state.title = data.data.length>0 ? data.data[0].title : ''
                    state.minute = data.data.length>0 ? readingTime(data.data[0].content).text : ''
                    return state
                })
            })
        })
    }

    componentDidMount() {
        const gridWidth = 128
        const elem = document.querySelector('.nav-cta');
        if(elem) {
            let masonry = new Masonry( elem, {
                // options
                itemSelector: '.prayer-grid',
                columnWidth: gridWidth,
                gutter: 10
            });
        }
        const carouselPrayer = document.getElementById('carouselPrayer')
        if(carouselPrayer) {
            carouselPrayer.addEventListener('slide.bs.carousel', ({direction, relatedTarget, from, to})=>{
                this.setState(state=>{
                    state.title = state.data[to].title
                    state.minute = readingTime(state.data[to].content).text
                    state.animate = true
                    return state
                })
            })
            carouselPrayer.addEventListener('slid.bs.carousel', ({direction, relatedTarget, from, to})=>{
                this.setState(state=>{
                    state.animate = false
                    return state
                })
            })
        }
        if(document.querySelector('[data-id="fihirana"]')) {
            const data = JSON.parse(document.querySelector('[data-id="vavaka"]').textContent)
            this.setState(state => {
                state.data = data.data
                state.title = data.data.length>0 ? data.data[0].title : ''
                state.minute = data.data.length>0 ? readingTime(data.data[0].content).text : ''
                state.animate = true
                return state
            })
        }
        fetch('/prayers').then(response => {
            response.json().then(data => {
                this.setState(state => {
                    state.feed = data.data
                    state.title = data.data.length>0 ? data.data[0].title : ''
                    state.minute = data.data.length>0 ? readingTime(data.data[0].content).text : ''
                    state.animate = true
                    return state
                }, ()=>{
                    if(elem) {
                        masonry = new Masonry( elem, {
                            // options
                            itemSelector: '.prayer-grid',
                            columnWidth: gridWidth,
                            gutter: 10
                        });
                    }
                })
            })
        })
        mapboxgl.accessToken = 'pk.eyJ1IjoiZm9sb2pvbmEiLCJhIjoiY2t6cjJ6cm00MGU2eTJvbzlldWZ6am95NyJ9.OOZ7U-FYWkgkTaDtb9QZLg';
        /*navigator.geolocation.getCurrentPosition(position=>{
            
        });*/
        /*new mapboxgl.Map({
            container: this.map.current,
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [47.52165518370213, -18.91091282317451],
            zoom: 13
        });*/
    }

    buildCarousel() {
        return <div id="carouselPrayer" className="col-md-6 carousel slide carousel-secondary" data-bs-interval="false" data-bs-ride="carousel">
            <div className="carousel-indicators">
                {this.state.data.map((item, index) => <button key={`button${item.id}`} type="button" data-bs-target={`#carouselPrayer`} data-bs-slide-to={index} className={index==0?'active':''} aria-current="true" aria-label={item.title}></button>)}
            </div>
            <div className="nav-slider align-items-center d-flex d-xxl-none justify-content-between" style={{minHeight:48}}>
                <button type="button" className="btn" data-bs-target="#carouselPrayer" data-bs-slide="prev">
                    <span className="bi bi-arrow-left-circle-fill" aria-hidden="true"></span>
                    <span className="visually-hidden">Précédent</span>
                </button>
                <CSSTransition in={this.state.animate} timeout={200} classNames="my-node">
                    <h5 className="m-0 text-center" style={{lineHeight:'12px'}}>{this.state.title}<br/><small style={{fontSize:10}}>{this.state.minute}</small></h5>
                </CSSTransition>
                <button type="button" className="btn" data-bs-target="#carouselPrayer" data-bs-slide="next">
                    <span className="bi bi-arrow-right-circle-fill" aria-hidden="true"></span>
                    <span className="visually-hidden">Suivant</span>
                </button>
            </div>
            <div className="prayer-carousel-inner p-5">
                {this.state.data.map((item, index) => <div key={item.id} id={`prayer${item.id}`} className={`carousel-item ${index == 0 ? 'active' : ''}`}>
                    <div className="d-flex flex-column justify-content-center">
                        <div className="prayer-content">
                            <div dangerouslySetInnerHTML={{ __html: md.render(item.content) }}></div>
                        </div>
                    </div>
                </div>)}
            </div>
            <div className="d-flex d-xxl-none justify-content-between">
                <button type="button" className="btn" data-bs-target="#carouselPrayer" data-bs-slide="prev">
                    <span className="bi bi-arrow-left-circle-fill" aria-hidden="true"></span>
                    <span className="visually-hidden">Précédent</span>
                </button>
                <button type="button" className="btn" data-bs-target="#carouselPrayer" data-bs-slide="next">
                    <span className="bi bi-arrow-right-circle-fill" aria-hidden="true"></span>
                    <span className="visually-hidden">Suivant</span>
                </button>
            </div>
        </div>
    }

    render() {
        return <Karaoke height={this.props.height} data={this.props.data}/>

        //https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/47.5208,-18.9104,16.99,122,60/300x300?access_token=pk.eyJ1IjoiZm9sb2pvbmEiLCJhIjoiY2t6cjJtMjRpNWR2MDJubzFmaDZ6eWR0diJ9.i2x0Mq4dFbCAbAeTS8iueg
        return <div className='d-flex bg-prayer'>
            <Karaoke/>
            <div className='d-md-block d-none'>
                <div ref={this.map} className='church-map'>
                    <img src="/storage/uploads/mapbox-sample.jpeg" className='church-profile-pic'/>
                    <img src="/storage/uploads/ambatonilita.jpeg" className='church-badge'/>
                    <i className='bi bi-geo-alt-fill position-absolute text-danger'></i>
                </div>
                <div className={`nav-cta ${this.state.current}`}>
                    <div className='prayer-grid'>
                        <button type="button" className='btn btn-fitsaohana' onClick={this.fifonana}><img src={fifonana} alt={trans('Mifona')} width='100%'/> {trans('Mifona')}</button>
                    </div>
                    <div className='prayer-grid'>
                        <button type="button" className='btn btn-fitsaohana' onClick={this.fitsaohana}><img src={fitsaohana} alt={trans('Mitsaoka')}  width='100%'/> {trans('Mitsaoka')}</button>
                    </div>
                    <div className='prayer-grid'>
                        <button type="button" className='btn btn-fisaorana' onClick={this.fisaorana}><img src={fisaorana} alt={trans('Misaotra')}  width='100%'/> {trans('Misaotra')}</button>
                    </div>
                    <div className='prayer-grid'>
                        <button type="button" className='btn btn-fangatahana' onClick={this.fangatahana}><img src={mangataka} alt={trans('Mangataka')}  width='100%'/> {trans('Mangataka')}</button>
                    </div>
                    {this.state.feed.map(feed=><div key={`feed-${feed.id}`} className='prayer-grid'>
                        <div className='btn-fangatahana'><img src={mangataka} alt={trans('Mangataka')}  width='100%'/>
                            <h6>{feed.title}</h6>
                            <div className='detail' dangerouslySetInnerHTML={{__html:truncate(feed.content, 40)}}></div>
                        </div>
                        <div className='d-flex justify-content-between prayer-grid-actions'>
                            <button className='iombonako-btn' type='button' onClick={this.fifonana}><i className='bi bi-heart-fill'></i></button>
                            <button className='alai-modely-btn'><i className='bi bi-palette'></i></button>
                        </div>
                    </div>)}
                </div>
            </div>
        </div>
    }
}

export default Modelizer(Prayers)