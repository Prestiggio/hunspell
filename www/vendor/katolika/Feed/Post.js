import React, {Component} from 'react';
import MarkdownIt from 'markdown-it';
import moment from 'moment';
import './Post.scss';
import readingTime from "reading-time/lib/reading-time";
import store from 'Core/Store';
import Modelizer from 'Core/Modelizer';
import { faker } from '@faker-js/faker';
import numeral from 'numeral';

const md = new MarkdownIt()

class Actions extends Component
{
    render() {
        return <div className='card-footer d-flex justify-content-between'>
            <a className={`btn border-0 btn-outline-primary ${this.models('props.allow.info')?'':'disabled'}`} href={this.models('props.allow.info.href')}><i className='bi bi-info'></i></a>
            <button className={`btn border-0 btn-outline-primary ${this.models('props.allow.print')?'':'disabled'}`} type="button"><i className='bi bi-map'></i></button>
            <button className={`btn border-0 btn-outline-primary ${this.models('props.allow.play')?'':'disabled'}`} type="button" onClick={this.props.makeCue}><i className='bi bi-play-btn-fill'></i></button>
            <button className={`btn border-0 btn-outline-primary ${this.models('props.allow.reminder')?'':'disabled'}`} type="button"><i className='bi bi-calendar-plus'></i></button>
            <button className={`btn border-0 btn-outline-primary ${this.models('props.allow.cart')?'':'disabled'}`} type="button"><i className='bi bi-cart-plus'></i></button>
        </div>
    }
}

Modelizer(Actions)

class Post extends Component
{
    constructor(props) {
        super(props)
        this.makeCue = this.makeCue.bind(this)
    }

    makeCue() {
        if(this.models('props.data.actions.play.videos', []).length>0) {
            store.dispatch({
                type: 'play_video',
                videos: this.models('props.data.actions.play.videos', [])
            })
        }
        else if(this.models('props.data.shared_content.liturgy.hour.steps')) {
            let cues = []
            let t = 0
            const destep = (st, i)=>{
                if(st.content) {
                    st.content.split(/\<[^\>]+\>/g).map((part, index)=>{
                        if(!/^aelf::/.test(part)) {
                            const rt = readingTime(part, {
                                wordsPerMinute: 88
                            })
                            cues.push({
                                id: st.id+','+i+','+index,
                                startTime: t / 1000,
                                endTime: (t + rt.time) / 1000,
                                text: part
                            })
                            t += rt.time
                        }
                    })
                }
                if(st.steps) {
                    st.steps.map(step=>{
                        destep(step, i)
                    })
                }
            }
            this.props.data.shared_content.liturgy.hour.steps.map((step, index)=>{
                destep(step, index)
            })
            store.dispatch({
                type: 'readtext',
                data: cues,
                id: 'readings' + this.props.data.id
            })
        }
    }

    render() {
        if(this.props.data.type=='textimage') {
            return <div className='card card-feed my-1'>
                <a href={`#dialog/gallery/${this.props.data.id}`} data-display="modal-xl modal-dialog-centered" className='text-center'><img src={this.props.data.medias[0].fullpath}/></a>
                <div className="d-flex flex-column h-100 justify-content-between">
                    <div className="px-3 bg-ktowhite">
                        <img className='nav-profile-pic me-1' src={this.props.data.seal.profile_photo_url}/>
                        <small>{this.props.data.seal.name}</small> - <small className="text-muted">{moment(this.props.data.created_at).fromNow()}</small>
                        {this.models('props.data.nhits')?<React.Fragment>
                            <i className='kto-follow ms-2 text-primary'></i> {numeral(this.models('props.data.nhits', 0)).format('0a')}
                        </React.Fragment>:null}
                    </div>
                </div>
            </div>
        }
        if(this.props.data.medias.length>0) {
            return <div className='card card-feed my-1'>
                <div className='card-body p-0'>
                    <div className="row">
                        <div className="col-auto">
                            <a href={`#dialog/gallery/${this.props.data.id}`} data-display="modal-xl modal-dialog-centered"><img src={this.props.data.medias[0].fullpath} className="img-fluid rounded-start"/></a>
                        </div>
                        <div className="col d-flex flex-column justify-content-between me-3">
                            <div className="py-3" dangerouslySetInnerHTML={{__html:md.render(this.models('props.data.text', ''))}}></div>
                            <div className='card-log mb-3'>
                                <div>
                                    <small className="text-muted" key={this.props.update}>{moment(this.props.data.created_at).fromNow()}</small>
                                    {this.models('props.data.nhits')?<React.Fragment>
                                        <i className='kto-follow ms-2 text-primary'></i> {numeral(this.models('props.data.nhits', 0)).format('0a')}
                                    </React.Fragment>:null}
                                </div>
                                <div>
                                    <img className='nav-profile-pic me-1' src={this.props.data.seal.profile_photo_url}/> <small>{this.props.data.seal.name}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Actions allow={this.props.data.actions} makeCue={this.makeCue}/>
            </div>
        }
        return <div className='card card-feed my-1'>
            <div className='card-body'>
                <div dangerouslySetInnerHTML={{__html:md.render(this.models('props.data.text', ''))}}></div>
                <div className='card-log'>
                    <div>
                        <small className="text-muted" key={this.props.update}>{moment(this.props.data.created_at).fromNow()}</small>
                        {this.models('props.data.nhits')?<React.Fragment>
                            <i className='kto-follow ms-2 text-primary'></i> {numeral(this.models('props.data.nhits', 0)).format('0a')}
                        </React.Fragment>:null}
                    </div>
                    <div>
                        <img className='nav-profile-pic me-1' src={this.props.data.seal.profile_photo_url}/> <small>{this.props.data.seal.name}</small>
                    </div>
                </div>
            </div>
            <Actions allow={this.props.data.actions} makeCue={this.makeCue}/>
        </div>
    }
}

export default Modelizer(Post)