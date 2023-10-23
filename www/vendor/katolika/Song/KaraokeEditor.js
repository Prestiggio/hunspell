import React, {Component} from 'react';
import trans from 'Core/translations';
import Modelizer from 'Core/Modelizer';
import {WebVTT, VTTCue, VTTRegion} from 'vtt.js';
import WaveSurfer from 'wavesurfer.js';
import WaveSurferRegions from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import Mpitendry from './Mpitendry';
import numeral from 'numeral';
import Uploader from 'Core/Uploader';
import MarkdownIt from 'markdown-it';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat.js';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder.js';
import CKFinderUploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter.js';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
import Image from '@ckeditor/ckeditor5-image/src/image.js';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption.js';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle.js';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar.js';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js';
import Indent from '@ckeditor/ckeditor5-indent/src/indent.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed.js';
import Markdown from '@ckeditor/ckeditor5-markdown-gfm/src/markdown';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js';
import Table from '@ckeditor/ckeditor5-table/src/table.js';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import store from 'Core/Store';
import playlist from '../Playlist';

const md = new MarkdownIt()

let ID = 0

class Editor extends ClassicEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
    Markdown,
    Autoformat,
    BlockQuote,
    Bold,
    CKFinder,
    CKFinderUploadAdapter,
    CloudServices,
    Essentials,
    Heading,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    Italic,
    Link,
    List,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    Table,
    TableToolbar,
    TextTransformation,
    SourceEditing
    //SimpleBox,
    //Placeholder
  ];
  
  // Editor configuration.
  Editor.defaultConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'outdent',
        'indent',
        '|',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        'undo',
        'redo',
        '|',
        'htmlEmbed',
        'sourceEditing'
      ]
    },
    language: 'fr',
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    },
    htmlSupport: {
      allow: [
        {
          name: /.*/,
          attributes: true,
          classes: true,
          styles: true
        }
      ],
      disallow: []
    },
    /*karaks: {
      karaksRenderer: (basedom)=>{
        ReactDOM.render(<Tutu/>, basedom)
      }
    }*/
  };

class LyricsLine extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        const value = e.target.value
        this.setState(state=>{
            state.data.setLine(value)
            return state
        })
    }

    render() {
        return <div className='d-flex justify-content-between align-items-center'>
            <button className='btn btn-primary me-3' type="button" onClick={this.props.tick}><i className='bi bi-play'></i></button>
            <input type="text" value={this.state.data.getLine()} onChange={this.handleChange} className="form-control flex-fill"/>
            {this.props.times.map(time=><button key={`${this.props.pkey}-${time.id}`} className='btn btn-danger' style={{width:85}} type='button' onClick={()=>this.props.deleteTime(time)}><i className='bi bi-x-circle-fill'></i> <small>{numeral(time.t).format('0.0')}</small></button>)}
        </div>
    }
}

class Cue extends Component
{
    render() {
        return <div dangerouslySetInnerHTML={{__html:this.props.data.text}} className={`cue-item mx-3 ${this.props.show ? '':'d-none'} ${this.props.current ? 'current':''}`}>
        </div>
    }
}

class Song
{
    #lyrics_lines = []
    #lines
    #content
    #title
    #id
    #instrumental
    #style

    constructor(data) {
        this.#content = data.content
        this.#title = data.title
        this.#id = data.id
        this.#lines = this.#content.split(/\\\\*n/)
        this.#instrumental = data.instrumental ?? false
        this.#style = data.instrumental?.title ?? ''
        if(data.instrumental?.cues) {
            data.instrumental.cues.map(cue=>{
                const nid = cue.key.split('-')
                this.#lyrics_lines.push(new KaraokeLine({
                    id: nid[nid.length-1],
                    line: cue.text
                }))
            })
        }
        this.dump = this.dump.bind(this)
        this.insertLineBefore = this.insertLineBefore.bind(this)
        this.setLines = this.setLines.bind(this)
        this.setLyricsLines = this.setLyricsLines.bind(this)
        this.setContent = this.setContent.bind(this)
        this.getContent = this.getContent.bind(this)
        this.getTitle = this.getTitle.bind(this)
        this.getStyle = this.getStyle.bind(this)
        this.setStyle = this.setStyle.bind(this)
        this.getLyricsLines = this.getLyricsLines.bind(this)
        this.getInstrumental = this.getInstrumental.bind(this)
        this.addCue = this.addCue.bind(this)
        this.removeCueAtTime = this.removeCueAtTime.bind(this)
        this.setInstrumental = this.setInstrumental.bind(this)
        this.hasInstrumental = this.hasInstrumental.bind(this)
    }

    setStyle(style) {
        this.#style = style
    }

    getStyle() {
        return this.#style
    }

    setInstrumental(instrumental) {
        this.#instrumental = instrumental
    }

    hasInstrumental() {
        return this.#instrumental
    }

    removeCueAtTime(time) {
        this.#instrumental.cues = this.#instrumental.cues.filter(it=>it.id!==time.id)
    }

    addCue(cue) {
        this.#instrumental.cues.push(cue)
    }

    getInstrumental() {
        return this.#instrumental
    }

    getLyricsLines() {
        return this.#lyrics_lines
    }

    getContent() {
        return this.#content
    }

    getTitle() {
        return this.#title
    }

    setTitle(title) {
        this.#title = title
    }

    setContent(content) {
        this.#content = content
    }

    setLines(lines) {
        this.#lines = lines
    }

    setLyricsLines(lines) {
        this.#lyrics_lines = lines
    }

    insertLineBefore(index, line) {
        this.#lyrics_lines.splice(index, 0, line)
    }

    dump() {
        let data = {
            id: this.#id,
            content: this.#content,
            title: this.#title,
            lines: this.#lines,
            instrumental_title: this.#style,
            instrumental: {...this.#instrumental}
        }
        console.log('sfdgdf', this.#instrumental)
        if(this.#instrumental) {
            data.instrumental.cues = []
            this.#instrumental.cues.map(cue=>{
                data.instrumental.cues.push({
                    text: cue.line.getLine(),
                    key: cue.key,
                    t: cue.t
                })
            })
        }
        return data
    }
}

class KaraokeLine
{
    #id;
    #line;
    #_id

    constructor(data) {
        ID++
        this.#_id = ID
        this.#id = data.id
        this.#line = data.line
        this.setLine = this.setLine.bind(this)
        this.getLine = this.getLine.bind(this)
        this.getId = this.getId.bind(this)
        this.getIndex = this.getIndex.bind(this)
    }

    toString() {
        return this.getLine()
    }

    getIndex() {
        return this.#_id
    }

    setLine(line) {
        this.#line = line
    }

    getLine() {
        return this.#line
    }

    getId() {
        return this.#id
    }
}

class KaraokeEditor extends Component
{
    #chunks = []

    constructor(props) {
        super(props)
        const data = new Song(typeof this.props.data === 'string' ? {
            content: this.props.data
        }: this.props.data)
        this.state = {
            t: 0,
            p: 0,
            playing: false,
            mute: false,
            delay: 0,
            hover: false,
            ready: false,
            editable: false,
            data,
            recording: false
        }
        this.id = 1
        this.insertId = 0
        this.editor = React.createRef()
        this.waveform = React.createRef()
        this.play = this.play.bind(this)
		this.pause = this.pause.bind(this)
        this.togglePause = this.togglePause.bind(this)
        this.rewind = this.rewind.bind(this)
        this.toggleMute = this.toggleMute.bind(this)
        this.startGenerate = this.startGenerate.bind(this)
        this.lyricsAddLine = this.lyricsAddLine.bind(this)
        this.deleteLyricsTime = this.deleteLyricsTime.bind(this)
        this.mouseOver = this.mouseOver.bind(this)
        this.mouseOut = this.mouseOut.bind(this)
        this.revealControl = this.revealControl.bind(this)
        this.insertLineBefore = this.insertLineBefore.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleStyleChange = this.handleStyleChange.bind(this)
        this.save = this.save.bind(this)
        this.record = this.record.bind(this)
        this.uploader = React.createRef()
    }

    record() {
        if(this.state.recording) {
            this.mediaRecorder.stop();
            console.log(this.mediaRecorder.state);
            console.log("recorder stopped");
            return
        }

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log("getUserMedia supported.");
            navigator.mediaDevices
              .getUserMedia(
                // constraints - only audio needed for this app
                {
                  audio: true,
                }
              )
          
              // Success callback
              .then((stream) => {
                this.setState({
                    recording: true
                })
                this.mediaRecorder = new MediaRecorder(stream);
                this.mediaRecorder.ondataavailable = (e) => {
                    this.#chunks.push(e.data);
                };
                this.mediaRecorder.onstop = (e) => {
                    console.log("recorder stopped");
                    const blob = new Blob(this.#chunks, { type: "audio/ogg; codecs=opus" });
                    blob.name = 'myrec.ogg'
                    this.uploader.current.addBlob(blob)
                    this.#chunks = [];
                    //const audioURL = window.URL.createObjectURL(blob);
                    //this.wavesurfer.load(audioURL)
                };
                this.mediaRecorder.start();
                console.log(this.mediaRecorder.state);
                console.log("recorder started");
              })
          
              // Error callback
              .catch((err) => {
                console.error(`The following getUserMedia error occurred: ${err}`);
              });
        } else {
            console.log("getUserMedia not supported on your browser!");
        }          
    }

    handleTitleChange(e) {
        const title = e.target.value
        this.setState(state=>{
            state.data.setTitle(title)
            return state
        })
    }

    handleStyleChange(e) {
        const style = e.target.value
        this.setState(state=>{
            state.data.setStyle(style)
            return state
        })
    }

    insertLineBefore(index) {
        this.insertId++
        this.setState(state=>{
            state.data.insertLineBefore(index, new KaraokeLine({
                id: `inserted${this.insertId}`,
                line: ''
            }))
            return state
        })
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
        if(!this.wavesurfer.isPlaying()) {
            this.wavesurfer.play()
        }
        this.setState(state=>{
            this.id++
            state.data.addCue({
                id: this.id,
                key,
                line,
                t: this.wavesurfer.getCurrentTime()
            })
            return state
        })
    }

    deleteLyricsTime(time) {
        this.setState(state=>{
            state.data.removeCueAtTime(time)
            return state
        })
    }

    startGenerate() {
        const lyrics = this.editorInstance.getData()
        const lines = lyrics.split(/\r?\n/)
        const lyrics_lines = []
        lines.filter(it=>/\w+/.test(it)).map((line, index)=>lyrics_lines.push(new KaraokeLine({
            line: line.trim(),
            id: index
        })))
        this.setState(state=>{
            state.data.setContent(lyrics)
            state.data.setLines(lines)
            state.data.setLyricsLines(lyrics_lines)
            return state
        })
    }

    rewind() {
        this.wavesurfer.skip(-10)
        this.setState(state=>{
            state.delay -= 10
            return state
        })
    }

    play() {
		this.wavesurfer.playPause();
	}
	
	pause() {
		this.region.play();
	}

    toggleMute() {
        this.wavesurfer.toggleMute()
        this.setState(state=>{
            state.mute = !state.mute
            return state
        })
    }

    togglePause() {
        this.wavesurfer.playPause()
        this.hover = setTimeout(()=>{
            this.mouseOut()
        }, 2000)
    }

    componentDidMount() {
        Editor.create(this.editor.current).then(editor => {
            this.editorInstance = editor
            window.editor = editor
            editor.model.document.on( 'change:data', () => {
                this.startGenerate()
            });
        })
        const style = getComputedStyle(document.body);
        this.wavesurfer = WaveSurfer.create({
		    container: this.waveform.current,
		    //waveColor: '#00000000',
		    //progressColor: '#F2B807AA',
		    waveColor: style.getPropertyValue('--wavecolor'),
		    progressColor: style.getPropertyValue('--progresscolor'),
			plugins: [
				WaveSurferRegions.create({}),
				Mpitendry.create({
					showTime : true
				})
			]
		});
        this.wavesurfer.on('ready', ()=>{
            this.setState({
				ready : true
			})
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
                state.hover = true
                return state
            })
            setTimeout(()=>{
                this.setState({
                    hover: false
                })
            }, 3000)
            let next = playlist.next()
            if(next) {
                this.wavesurfer.load(next.path)
                this.wavesurfer.on('ready', ()=>{
                    fetch(`/vtt?id=${next.id}`).then(response=>{
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
                })
            }
        })
        this.wavesurfer.on('audioprocess', ()=>{
            this.setState({
                p : this.wavesurfer.getCurrentTime()
            })
        })
        if(this.state.data.hasInstrumental()) {
            this.wavesurfer.load(this.state.data.getInstrumental().path)
            fetch(`/vtt?id=${this.state.data.getInstrumental().id}`).then(response=>{
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
            })
        }
    }

    save() {
        $.ajax({
            url: '/admin/songs',
            type: 'post',
            data: this.state.data.dump(),
            success: ()=>{
                /*store.dispatch({
                    type: 'dialog.dismiss'
                })*/
            }
        })
    }

    render() {
        return <div className='karaoke-editor'>
            {this.props.data.id?null:<div className='form-group'>
                <input type="text" placeholder={trans('Lohateny')} className="form-control" value={this.state.data.getTitle()} onChange={this.handleTitleChange}/>
            </div>}
            <textarea ref={this.editor} className='form-control' rows={24} defaultValue={md.render(this.state.data.getContent())}></textarea>
            <input type="hidden" name={`songs[${this.props.model}][${this.props.id}]`} value={JSON.stringify(this.state.data.dump())}/>
            <div className='align-items-center mx-0 row'>
                <div className='col-md-4'>
                    <label className='control-label'>{trans('Feon-kira arahana')}</label>
                </div>
                <div className='col-md-4'>
                    <input type="text" placeholder={trans('Fiavahany')} className="form-control" value={this.state.data.getStyle()} onChange={this.handleStyleChange}/>
                </div>
                <div className='col-md-2'>
                    <div className='karaoke-cues'>
                        <Uploader ref={this.uploader} id={this.props.data.id} params={this.state.data.dump} onSuccess={instrumental=>{
                            this.wavesurfer.load(instrumental.path);
                            this.setState(state=>{
                                instrumental.cues = []
                                state.data.setInstrumental(instrumental)
                                return state
                            }, this.startGenerate)
                        }} className="bg-ktoyellow btn d-flex dz-clickable justify-content-center" action="/admin/instrumentals/upload" name="instrumental_file" acceptedFiles=".wav,.mp3,.ogg">
                            <i className='bi bi-folder2-open'></i> {trans('Tondroy')}
                        </Uploader>
                    </div>
                </div>
                <div className='col-md-2'>
                    <button className='btn w-100 btn-danger' type='button' onClick={this.record}><i className='bi bi-record'></i> {trans('REC')}</button>
                </div>
            </div>
            <div className={this.state.data.hasInstrumental()?'position-relative':'d-none'}>
                <div className='list-group'>
                    <div className='list-group-item d-flex justify-content-between align-items-center'>
                        <button className='btn btn-primary me-3' type="button" onClick={()=>this.lyricsAddLine(new KaraokeLine({id:'pause', line:trans('Feon-kira')}), `${this.state.t}-l-pause`)}><i className='bi bi-play'></i></button>
                        <input type="text" defaultValue={trans('Feon-kira')} className="form-control flex-fill"/> <i className='bi bi-pause-btn-fill'></i>
                        {this.cast(this.state.data.getInstrumental(), 'cues', []).filter(it=>it.key===`${this.state.t}-l-pause`).map(time=><button key={`${this.state.t}-l-pause-${time.id}`} className='btn btn-danger' style={{width:85}} type='button' onClick={()=>this.deleteLyricsTime(time)}><i className='bi bi-x-circle-fill'></i> <small>{numeral(time.t).format('0.0')}</small></button>)}
                    </div>
                    {this.state.data.getLyricsLines().filter(it=>it.getId()!='pause').map((line, index)=><div key={`${this.state.t}-l-${line.getId()}-${line.getIndex()}`}>
                        <div style={{height:10}} className='list-group-item bg-secondary position-relative'>
                            <button style={{right:10, top:-5}} className='badge bg-ktowhite btn fs-6 p-1 position-absolute rounded-pill text-secondary' type='button' onClick={()=>this.insertLineBefore(index)}><i className='bi bi-plus-circle'></i></button>
                        </div>
                        <div className='list-group-item'>
                            <LyricsLine pkey={`${this.state.t}-l-${line.getId()}`} data={line} tick={()=>this.lyricsAddLine(line, `${this.state.t}-l-${line.getId()}`)} times={this.cast(this.state.data.getInstrumental(), 'cues', []).filter(it=>it.key===`${this.state.t}-l-${line.getId()}`)} deleteTime={time=>this.deleteLyricsTime(time)}/>
                        </div>
                    </div>)}
                </div>
                <div className="position-sticky bg-light" style={{bottom:0}}>
                    <div ref={this.waveform} className="position-relative"></div>
                    {this.cast(this.state.data.getInstrumental(), 'cues', []).map((cue, index)=><Cue key={`cue-${cue.id}-${this.state.t}`} data={cue} show={((index==0 && this.state.p<=this.state.data.getInstrumental().cues[0].endTime) || (this.state.p>=this.state.data.getInstrumental().cues[index>0?index-1:index].startTime && this.state.p<=this.state.data.getInstrumental().cues[this.state.data.getInstrumental().cues.length-1>index?index+1:index].endTime))} current={(this.state.p>=cue.startTime && this.state.p<=cue.endTime)}/>)}
                    <div className={`w-100 prayer-player`}>
                        {this.state.ready?<div className='prayer-player-actions'>
                            <button className='btn text-primary' type="button" onClick={this.rewind}><i className='bi bi-arrow-counterclockwise'></i></button>
                            <button className='btn text-primary' type="button" onClick={this.togglePause}>{this.state.playing?<i className='bi bi-pause-circle-fill'></i>:<i className='bi bi-play-circle-fill'></i>}</button>
                            <button className='btn text-primary' type="button" onClick={this.toggleMute}>{this.state.mute?<i className='bi bi-volume-mute-fill'></i>:<i className='bi bi-volume-up-fill'></i>}</button>
                        </div>:null}
                    </div>
                </div>
            </div>
            <button className='btn btn-primary w-100' type='button' onClick={this.save}>{trans('Raiketo')}</button>
        </div>
    }
}

export default Modelizer(KaraokeEditor)