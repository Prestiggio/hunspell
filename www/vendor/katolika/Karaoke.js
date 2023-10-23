import anime from 'animejs';
import React, {Component} from 'react';
import Modelizer from 'Core/Modelizer';
import trans from 'Core/translations';
import {WebVTT, VTTCue, VTTRegion} from 'vtt.js';
import WaveSurfer from 'wavesurfer.js';
import Loading from 'katolika/Loading';
import store from 'Core/Store';
import playlist from './Playlist';
import Video from 'facebook/Components/Video';

class Cue extends Component
{
    render() {
        if(this.props.data.url) {
            return <div><Video data={{src:this.props.data.url}}/></div>
        }
        if(this.props.data.text==='Feon-kira') {
            return <div className={`cue-item mx-3 ${this.props.show ? '':'d-none'} ${this.props.current ? 'current':''}`}>
                <i className='bi bi-music-note-beamed'></i><i className='bi bi-music-note-beamed'></i><i className='bi bi-music-note-beamed'></i>
            </div>
        }
        return <div dangerouslySetInnerHTML={{__html:this.props.data.text}} className={`cue-item mx-3 ${this.props.show ? '':'d-none'} ${this.props.current ? 'current':''}`}>
        </div>
    }
}

class Karaoke extends Component
{
    #currentPlaying

    constructor(props) {
        super(props)
        this.state = {
            id: 'audio0',
            cues: [],
            t: 0,
            p: 0,
            playing: false,
            mute: false,
            delay: 0,
            lyrics: false,
            lyrics_lines:[],
            lyrics_times:[],
            hover: false,
            ready: false,
            editable: false,
            type: 'audio'
        }
        this.id = 1
        this.waveform = React.createRef()
        this.lyrics = React.createRef()
        this.togglePause = this.togglePause.bind(this)
        this.rewind = this.rewind.bind(this)
        this.toggleMute = this.toggleMute.bind(this)
        this.startGenerate = this.startGenerate.bind(this)
        this.lyricsAddLine = this.lyricsAddLine.bind(this)
        this.deleteLyricsTime = this.deleteLyricsTime.bind(this)
        this.mouseOver = this.mouseOver.bind(this)
        this.mouseOut = this.mouseOut.bind(this)
        this.revealControl = this.revealControl.bind(this)
        this.wavesurferReady = this.wavesurferReady.bind(this)
        this.animations = {
            zoom : false
        }
    }

    revealControl() {
        if(this.hover) {
            clearTimeout(this.hover)
        }
        this.hover = setTimeout(()=>{
            this.mouseOut()
        }, 3000)
        this.setState({
            hover: true
        })
    }

    mouseOver() {
        if(this.hover) {
            clearTimeout(this.hover)
        }
        this.hover = setTimeout(()=>{
            this.mouseOut()
        }, 2000)
        this.setState({
            hover: true
        })
    }

    mouseOut() {
        this.setState({
            hover: false
        })
    }

    lyricsAddLine(line, key) {
        this.setState(state=>{
            this.id++
            state.lyrics_times.push({
                id: this.id,
                key,
                text: line,
                t: this.wavesurfer.getCurrentTime()
            })
            return state
        })
    }

    deleteLyricsTime(time) {
        this.setState(state=>{
            state.lyrics_times = state.lyrics_times.filter(it=>it.id!==time.id)
            return state
        })
    }

    startGenerate() {
        const lyrics = this.lyrics.current.value
        const lyrics_lines = lyrics.split(/\r?\n/)
        this.setState({
            lyrics_lines
        })
    }

    rewind() {
        this.wavesurfer.skip(-10)
        this.setState(state=>{
            state.delay -= 10
            return state
        })
    }

    toggleMute() {
        this.wavesurfer.toggleMute()
        this.setState(state=>{
            state.mute = !state.mute
            return state
        })
    }

    togglePause() {
        if(this.state.type==='audio') {
            this.wavesurfer.playPause()
        }
        this.hover = setTimeout(()=>{
            this.mouseOut()
        }, 2000)
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.animations.zoom && prevProps.height) {
            this.animations.zoom.seek(prevProps.height/100*this.animations.zoom.duration)
        }
    }

    wavesurferReady() {
        fetch(`/vtt?id=${this.#currentPlaying}`).then(response=>{
            return response.text()
        }).then(data=>{
            const parser = new WebVTT.Parser(window, WebVTT.StringDecoder())
            let cues = []
            parser.oncue = cue=>{
                cues.push(cue);
            }
            parser.parse(data);
            parser.flush();

            this.setState(state=>{
                state.ready = true
                state.hover = true
                state.cues = cues
                return state
            })
            setTimeout(()=>{
                this.setState({
                    hover: false
                })
                this.wavesurfer.play()
            }, 3000)
        })
    }

    componentDidMount() {
        $(document).scrollTop(0);
        this.animations.zoom = anime({
            targets: '.karaoke-cues',
            zoom: .5,
            duration: 400,
            easing: 'easeInOutSine',
            autoplay: false
        })
        this.wavesurfer = WaveSurfer.create({
		    container: this.waveform.current,
		    waveColor: '#00000000',
		    progressColor: '#F2B807AA'
		});
        this.wavesurfer.on('ready', ()=>{
            
		})
        this.wavesurfer.on('play', ()=>{
            this.setState({
				playing : true
			})
        })
        this.wavesurfer.on('pause', ()=>{
            this.setState({
                playing : false
            })
        })
        this.wavesurfer.on('finish', ()=>{
            this.setState(state=>{
                state.t++
                state.hover = true
                return state
            }, ()=>{
                let next = playlist.next()
                if(next) {
                    this.wavesurfer.load(next.path)
                    this.#currentPlaying = next.id
                    this.wavesurfer.un('ready', this.wavesurferReady)
                    this.wavesurfer.on('ready', this.wavesurferReady)
                }
            })
            setTimeout(()=>{
                this.setState({
                    hover: false
                })
            }, 3000)
        })
        this.wavesurfer.on('audioprocess', ()=>{
            this.setState({
                p : this.wavesurfer.getCurrentTime()
            })
        })
        if(this.props.data.track0) {
            playlist.append(this.props.data.track0)
            const program = playlist.next()
            this.wavesurfer.load(program.path)
            fetch(`/vtt?id=${this.props.data.track0.id}`).then(response=>{
                //https://www.youtube.com/results?search_query=Eucharistic+Adoration
                //https://www.pexels.com/search/videos/loop/
                //https://codepen.io/dudleystorey/pen/aONdzJ
                //https://www.youtube.com/watch?v=rz5gektkF0o
                //https://www.youtube.com/watch?v=Dd7YbWyPcQo
                //https://www.youtube.com/watch?v=IU9C91Ujh3M
                //https://www.youtube.com/watch?v=s-ZWahol1Bg
                return response.text()
            }).then(data=>{
                const parser = new WebVTT.Parser(window, WebVTT.StringDecoder())
                let cues = []
                parser.oncue = cue=>{
                    cues.push(cue);
                }
                parser.parse(data);
                parser.flush();

                this.setState(state=>{
                    state.ready = true
                    state.hover = true
                    state.cues = cues
                    return state
                })
                setTimeout(()=>{
                    this.setState({
                        hover: false
                    })
                }, 3000)
            })
        }
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type==='playnow') {
                this.setState({
                    type: 'audio'
                })
                this.#currentPlaying = storeState.id
                this.wavesurfer.un('ready', this.wavesurferReady)
                this.wavesurfer.on('ready', this.wavesurferReady)
                this.wavesurfer.load(storeState.path)
            }
            if(storeState.type==='readtext') {
                this.#currentPlaying = storeState.id
                this.setState({
                    type: 'text',
                    id: storeState.id,
                    cues: storeState.data
                })
                let p = 0
                if(this.textreading) {
                    clearInterval(this.textreading)
                }
                this.textreading = setInterval(()=>{
                    this.setState({
                        p
                    })
                    p++
                }, 1000)
            }
            if(storeState.type==='play_video') {
                this.setState({
                    id: 'video',
                    type: 'video',
                    cues: [
                        {
                            startTime:0,
                            endTime:1000,
                            url: storeState.videos[0]
                        }
                    ]
                })
            }
        })
    }

    render() {
        return <div className={`position-relative flex-fill px-0 h-100 prayer-slide ${this.state.hover?'hover':''}`} onMouseMove={this.mouseOver} onMouseOut={this.mouseOut} onClick={this.revealControl}>
            <div className={`karaoke-cues d-flex flex-column align-items-center h-100 w-100 justify-content-center`}>
                {this.state.cues.length==0?<Loading/>:null}
                {this.state.cues.map((cue, index)=><Cue key={`playing-${this.state.id}-cue-${cue.id}-${this.state.t}`} data={cue} show={((index==0 && this.state.p<=this.state.cues[0].endTime) || (this.state.p>=this.state.cues[index>0?index-1:index].startTime && this.state.p<=this.state.cues[this.state.cues.length-1>index?index+1:index].endTime))} current={(this.state.p>=cue.startTime && this.state.p<=cue.endTime)}/>)}
                <div className={`w-100 waveform`} ref={this.waveform}></div>
            </div>
            <div className={`w-100 prayer-player`}>
                {this.state.ready?<div className='prayer-player-actions'>
                    <button className='btn text-ktowhite' type="button" onClick={this.rewind}><i className='bi bi-arrow-counterclockwise'></i></button>
                    <button className='btn text-ktowhite' type="button" onClick={this.togglePause}>{this.state.playing?<i className='bi bi-pause-circle-fill'></i>:<i className='bi bi-play-circle-fill'></i>}</button>
                    <button className='btn text-ktowhite' type="button" onClick={this.toggleMute}>{this.state.mute?<i className='bi bi-volume-mute-fill'></i>:<i className='bi bi-volume-up-fill'></i>}</button>
                </div>:null}
            </div>
            {this.state.editable?<div className='karaoke-editor'>
                {this.state.lyrics_lines.length==0?<div>
                    <textarea ref={this.lyrics} className='form-control' rows={24} defaultValue={this.state.lyrics}></textarea>
                    <button className='btn btn-primary' type="button" onClick={this.startGenerate}>{trans('Start generate VTT')}</button>
                </div>:null}
                <div className='list-group'>
                    <div className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'>
                        <button className='btn btn-primary me-3' type="button" onClick={()=>this.lyricsAddLine('', `${this.state.t}-l-pause`)}><i className='bi bi-play'></i></button>
                        <span className='flex-fill'>{trans('Pause')}</span>
                        {this.state.lyrics_times.filter(it=>it.key===`${this.state.t}-l-pause`).map(time=><button key={`${this.state.t}-l-pause-${time.id}`} className='btn btn-danger' style={{width:85}} type='button' onClick={()=>this.deleteLyricsTime(time)}><i className='bi bi-x-circle-fill'></i> <small>{numeral(time.t).format('0.0')}</small></button>)}
                    </div>
                    {this.state.lyrics_lines.filter(it=>/\w+/.test(it)).map((line, index)=><div className='list-group-item list-group-item-action d-flex justify-content-between align-items-center' key={`${this.state.t}-l-${index}`}>
                        <button className='btn btn-primary me-3' type="button" onClick={()=>this.lyricsAddLine(line, `${this.state.t}-l-${index}`)}><i className='bi bi-play'></i></button>
                        <span className='flex-fill'>{line}</span>
                        {this.state.lyrics_times.filter(it=>it.key===`${this.state.t}-l-${index}`).map(time=><button key={`${this.state.t}-l-${index}-${time.id}`} className='btn btn-danger' style={{width:85}} type='button' onClick={()=>this.deleteLyricsTime(time)}><i className='bi bi-x-circle-fill'></i> <small>{numeral(time.t).format('0.0')}</small></button>)}
                    </div>)}
                </div>
            </div>:null}
        </div>
    }
}

export default Modelizer(Karaoke)