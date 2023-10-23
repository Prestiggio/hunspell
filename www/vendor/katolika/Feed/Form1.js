import React, {Component} from 'react';
import trans from 'Core/translations';
import Modelizer from 'Core/Modelizer';
import Mention from '@ckeditor/ckeditor5-mention/src/mention';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
import Indent from '@ckeditor/ckeditor5-indent/src/indent.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import Markdown from '@ckeditor/ckeditor5-markdown-gfm/src/markdown';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import Uploader from 'Core/Uploader';
import './Form1.scss';
import Azoantoka from 'Azoantoka';
import Post from './Post';
import moment from 'moment';
import laravelEcho from 'katolika/Echo';

//https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html#fully-customized-mention-feed

function KTO( editor ) {
    // The upcast converter will convert view <a class="mention" href="" data-user-id="">
    // elements to the model 'mention' text attribute.
    //debugger
    editor.ui.view.toolbar.class = 'alpha-0 position-absolute feed-ck-toolbar d-none';
    editor.ui.view.editable.template.attributes.class.push('feed-ck-editor')
    editor.conversion.for( 'upcast' ).elementToAttribute( {
        view: {
            name: 'a',
            key: 'data-mention',
            classes: 'txt-info',
            attributes: {
                href: true,
                'data-user-id': true
            }
        },
        model: {
            key: 'mention',
            value: viewItem => {
                // The mention feature expects that the mention attribute value
                // in the model is a plain object with a set of additional attributes.
                // In order to create a proper object use the toMentionAttribute() helper method:
                const mentionAttribute = editor.plugins.get( 'Mention' ).toMentionAttribute( viewItem, {
                    // Add any other properties that you need.
                    link: viewItem.getAttribute( 'href' ),
                    userId: viewItem.getAttribute( 'data-user-id' )
                } );

                return mentionAttribute;
            }
        },
        converterPriority: 'high'
    } );

    // Downcast the model 'mention' text attribute to a view <a> element.
    editor.conversion.for( 'downcast' ).attributeToElement( {
        model: 'mention',
        view: ( modelAttributeValue, { writer } ) => {
            // Do not convert empty attributes (lack of value means no mention).
            if ( !modelAttributeValue ) {
                return;
            }

            return writer.createAttributeElement( 'a', {
                class: 'text-info',
                'data-mention': modelAttributeValue.id,
                'data-user-id': modelAttributeValue.userId,
                'href': modelAttributeValue.link
            }, {
                // Make mention attribute to be wrapped by other attribute elements.
                priority: 20,
                // Prevent merging mentions together.
                id: modelAttributeValue.uid
            } );
        },
        converterPriority: 'high'
    } );
}

const items = [
    { id: '@swarley', userId: '1', name: 'Barney Stinson', link: 'https://www.imdb.com/title/tt0460649/characters/nm0000439' },
    { id: '@lilypad', userId: '2', name: 'Lily Aldrin', link: 'https://www.imdb.com/title/tt0460649/characters/nm0004989' },
    { id: '@marry', userId: '3', name: 'Marry Ann Lewis', link: 'https://www.imdb.com/title/tt0460649/characters/nm1130627' },
    { id: '@marshmallow', userId: '4', name: 'Marshall Eriksen', link: 'https://www.imdb.com/title/tt0460649/characters/nm0781981' },
    { id: '@rsparkles', userId: '5', name: 'Robin Scherbatsky', link: 'https://www.imdb.com/title/tt0460649/characters/nm1130627' },
    { id: '@tdog', userId: '6', name: 'Ted Mosby', link: 'https://www.imdb.com/title/tt0460649/characters/nm1102140' }
];

const hashitems = [
    { id: '#swarley', userId: '1', name: 'Barney Stinson', link: 'https://www.imdb.com/title/tt0460649/characters/nm0000439' },
    { id: '#lilypad', userId: '2', name: 'Lily Aldrin', link: 'https://www.imdb.com/title/tt0460649/characters/nm0004989' },
    { id: '#marry', userId: '3', name: 'Marry Ann Lewis', link: 'https://www.imdb.com/title/tt0460649/characters/nm1130627' },
    { id: '#marshmallow', userId: '4', name: 'Marshall Eriksen', link: 'https://www.imdb.com/title/tt0460649/characters/nm0781981' },
    { id: '#rsparkles', userId: '5', name: 'Robin Scherbatsky', link: 'https://www.imdb.com/title/tt0460649/characters/nm1130627' },
    { id: '#tdog', userId: '6', name: 'Ted Mosby', link: 'https://www.imdb.com/title/tt0460649/characters/nm1102140' }
];

function getFeedItems( queryText ) {
    // As an example of an asynchronous action, return a promise
    // that resolves after a 100ms timeout.
    // This can be a server request or any sort of delayed action.
    return new Promise( resolve => {
        setTimeout( () => {
            const itemsToDisplay = items
                // Filter out the full list of all items to only those matching the query text.
                .filter( isItemMatching )
                // Return 10 items max - needed for generic queries when the list may contain hundreds of elements.
                .slice( 0, 10 );

            resolve( itemsToDisplay );
        }, 100 );
    } );

    // Filtering function - it uses `name` and `username` properties of an item to find a match.
    function isItemMatching( item ) {
        // Make the search case-insensitive.
        const searchString = queryText.toLowerCase();

        // Include an item in the search results if name or username includes the current user input.
        return (
            item.name.toLowerCase().includes( searchString ) ||
            item.id.toLowerCase().includes( searchString )
        );
    }
}

function getHashItems( queryText ) {
    // As an example of an asynchronous action, return a promise
    // that resolves after a 100ms timeout.
    // This can be a server request or any sort of delayed action.
    return new Promise( resolve => {
        setTimeout( () => {
            const itemsToDisplay = hashitems
                // Filter out the full list of all items to only those matching the query text.
                .filter( isItemMatching )
                // Return 10 items max - needed for generic queries when the list may contain hundreds of elements.
                .slice( 0, 10 );

            resolve( itemsToDisplay );
        }, 100 );
    } );

    // Filtering function - it uses `name` and `username` properties of an item to find a match.
    function isItemMatching( item ) {
        // Make the search case-insensitive.
        const searchString = queryText.toLowerCase();

        // Include an item in the search results if name or username includes the current user input.
        return (
            item.name.toLowerCase().includes( searchString ) ||
            item.id.toLowerCase().includes( searchString )
        );
    }
}

function customItemRenderer( item ) {
    const itemElement = document.createElement( 'span' );

    itemElement.classList.add( 'custom-item' );
    itemElement.id = `mention-list-item-id-${ item.userId }`;
    itemElement.textContent = `${ item.name } `;

    const usernameElement = document.createElement( 'span' );

    usernameElement.classList.add( 'custom-item-username' );
    usernameElement.textContent = item.id;

    itemElement.appendChild( usernameElement );

    return itemElement;
}

class Editor extends ClassicEditor { }

// Plugins to include in the build.
Editor.builtinPlugins = [
    Markdown,
    Mention,
    KTO,
    BlockQuote,
    Bold,
    Essentials,
    Heading,
    Indent,
    Italic,
    Link,
    Paragraph,
    SourceEditing
];

Editor.defaultConfig = {
    toolbar: {
      items: [
        'bold',
        'italic',
        '|',
        'undo',
        'redo'
      ],
      shouldNotGroupWhenFull: true
    },
    mention: {
        feeds: [
            {
                marker: '@',
                feed: getFeedItems,
                itemRenderer: customItemRenderer
            },
            {
                marker: '#',
                feed: getHashItems,
                itemRenderer: customItemRenderer
            }
        ]
    },
    language: 'fr'
};

class Form1 extends Component
{
    #chunks = []
    #reader
    #imgId = 1

    constructor(props) {
        super(props)
        this.editor = React.createRef()
        this.uploader = React.createRef()
        this.record = this.record.bind(this)
        this.state = {
            content: '',
            recording: false,
            files: [],
            imgs: [],
            posts: [],
            submitted: false,
            publishing: false,
            t: moment().format('YYYYMMDDHHmmss'),
            saint: this.props.data.user,
            visitors: []
        }
        this.preUpload = this.preUpload.bind(this)
        this.send = this.send.bind(this)
        this.removeImg = this.removeImg.bind(this)
        this.setSaint = this.setSaint.bind(this)
        this.publish = this.publish.bind(this)
    }

    setSaint(saint) {
        this.setState({
            saint
        }, ()=>{
            $.ajax({
                url: '/saint-login',
                type: 'post',
                data: saint,
                success: ()=>{

                }
            })
        })
    }

    removeImg(id) {
        this.setState(state=>{
            state.imgs = state.imgs.filter(it=>it.id!=id)
            return state
        })
    }

    preUpload(file, allow) {
        /*Azoantoka.auth(this.props.data.popup_url).then(allow)/*.catch(()=>{
            console.log('tsy nanaiky ianao')
        })*/
        this.#imgId++
        this.#reader = new FileReader();
        this.#reader.onload = e=>{
            const src = e.target.result
            this.setState(state=>{
                state.imgs.push({
                    src,
                    id: this.#imgId
                })
                return state
            }, allow)
        };
        this.#reader.readAsDataURL(file);
    }

    publish() {
        if(this.props.data.user.is_tandanitra) {
            this.send('from_tandanitra')
        }
        else {
            this.setState({
                publishing: true
            })
        }
    }

    send(type) {
        $.ajax({
            type: 'post',
            url: '/presubmit',
            data: {
                text: this.state.content,
                type,
                files: this.state.files
            },
            success: response=>{
                console.log(response)
                this.setState({
                    submitted: true,
                    content: '',
                    imgs: [],
                    files: []
                }, ()=>{
                    window.editor.setData('')
                })
            }
        })
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

    componentDidMount() {
        $.ajax({
            url: '/feed',
            success: response=>{
                this.setState({
                    posts: response.data
                })
            }
        })
        $(document).on('keyup', e=>{
            if (e.key === "Escape") {
                this.setState({
                    publishing: false
                })
            }
        });
        laravelEcho.channel(`Katolika.Live.Feed`)
        .listen('LiveFeed', data=>{
            this.setState(state=>{
                state.submitted = false
                state.t = moment().format('YYYYMMDDHHmmss')
                if(data.wsconnections) {
                    state.visitors = data.wsconnections
                }
                else if(!state.posts.find(it=>it.id==data.id)) {
                    data.created_at = moment()
                    state.posts.unshift(data)
                }  
                return state
            })
        });
        laravelEcho.private(`Home${this.props.data.ip.replace(/\./g, '-')}`)
        .listen('LiveFeed', data=>{
            this.setState(state=>{
                state.submitted = false
                state.t = moment().format('YYYYMMDDHHmmss')
                if(!state.posts.find(it=>it.id==data.id)) {
                    data.created_at = moment()
                    state.posts.unshift(data)
                }  
                return state
            })
        });
        Editor.create(this.editor.current).then(editor => {
            //CKEditorInspector.attach(editor);
            this.editorInstance = editor
            window.editor = editor
            editor.model.document.on( 'change:data', () => {
                editor.ui.view.toolbar.class = `alpha-${editor.getData().length*50} ${editor.getData().length==0?'d-none':''} feed-ck-toolbar`;
                this.setState({
                    content: editor.getData()
                })
            });
        })
    }

    render() {
        return <React.Fragment>
            <div className='engage-form position-relative'>
                <div className='d-flex flex-preview'>
                    {this.state.imgs.map(img=><div className='position-relative img-preview' key={img.id}>
                        <img src={img.src} className='img-fluid'/>
                        <button className='btn btn-danger position-absolute' type='button' onClick={()=>this.removeImg(img.id)}><i className='bi bi-trash-fill'></i></button>
                    </div>)}
                </div>
                <div className={`${this.state.submitted?'d-none':'d-flex'} bg-white rounded px-lg-2`}>
                    <div className='flex-fill py-1'>
                        <textarea ref={this.editor} placeholder={trans('Eto raha hanoratra...')} name="text"></textarea>
                    </div>
                    <Uploader ref={this.uploader} preUpload={this.preUpload} onSuccess={media=>{
                        this.setState(state=>{
                            media.id = this.#imgId
                            state.files.push(media)
                            return state
                        })
                    }} className="btn p-0 px-1 align-self-end" action="/media/upload" name="media" clickable=".upload-media" acceptedFiles=".wav,.mp3,.ogg,.jpg,.jpeg,.png,.gif">
                        <i className='fs-1 bi bi-images upload-media text-ktoyellow'></i>
                    </Uploader>
                </div>
                <div className="align-items-center d-flex justify-content-between" style={{zoom:0.8}}>
                    <div className='text-ktowhite' style={{mixBlendMode:'luminosity'}}>
                        {this.state.visitors.length>0?<React.Fragment>
                            <i className='bi bi-person-fill text-ktowhite'></i> {this.state.visitors.length}
                        </React.Fragment>:null}
                    </div>
                    {this.props.data.saints?<div>
                        <span className='text-ktowhite' style={{mixBlendMode:'luminosity'}}>{trans("Manoràta amin'ny anaran'i ")}</span><div className='d-inline-block'>
                        <div className="btn-group">
                            <a className="btn" href={this.state.saint.biography_url} target="_blank"><img className='nav-profile-pic' src={this.state.saint.profile_photo_url}/><span className='text-ktowhite ms-2' style={{mixBlendMode:'luminosity'}}>{this.state.saint.name}</span></a>
                            <button type="button" className="btn dropdown-toggle dropdown-toggle-split text-ktowhite" style={{mixBlendMode:'luminosity'}} data-bs-toggle="dropdown" aria-expanded="false">
                                <span className="visually-hidden">{trans('Ovaina')}</span>
                            </button>
                            <ul className="dropdown-menu">
                                {this.props.data.saints.map(saint=><li key={saint.id}><button type='button' onClick={()=>this.setSaint(saint)} className="dropdown-item" ><img className='nav-profile-pic me-1' src={saint.profile_photo_url}/> {saint.name}</button></li>)}
                            </ul>
                            </div>
                        </div>
                    </div>:null}
                </div>
                <div className={`w-100 d-flex flex-wrap btn-feeds bg-ktoyellow justify-content-around alpha-${this.state.files.length>0?'100':this.state.content.length*30} ${(this.state.content.length>0 || this.state.files.length>0)?'':'d-none'}`}>
                    <button className='btn' type='button' title={trans('Alefa')} onClick={this.publish}><i className='bi bi-send-check-fill'></i> {trans('Alefa')}</button>
                </div>
            </div>
            <div className='feed-line'>
                {this.state.submitted?<div className="bg-warning p-3 rounded text-center">{trans('Mahandrasa azafady fa eo am-panapariahana ny hafatrao izahay. Misaotra tompoko')}</div>:null}
                {this.state.posts.map(post=><Post key={post.id} update={this.state.t} data={post}/>)}
            </div>
            <div className={`kto-modal overflow-scroll ${this.state.publishing?'kto-modal-show':''}`}>
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                    <div className="container-fluid">
                        <button type="button" className="navbar-brand btn" onClick={()=>this.setState({publishing:false})}><i className="bi bi-arrow-left-short"></i></button>
                    </div>
                </nav>
                {true?<div className='btn-feed-actions'>
                    {/http/.test(this.state.content)?<button className='btn' type='button' title={trans('Live')}>
                        <i className='bi bi-camera-reels-fill display-1 text-secondary'></i><br/>
                        {trans('Alefa mivantana')}<br/>
                        <div>
                            <i className='text-primary p-2 bi bi-play-btn-fill'></i>
                        </div>
                    </button>:null}
                    {this.models('props.data.user')?<button className='btn' type='button' title={trans('Evenement/liturgie (not live)')}>
                        <i className='bi bi-list-check display-1 text-secondary'></i><br/>
                        {trans('Hanomanana lamesa')}<br/>
                        <div>
                            <i className='text-primary p-2 bi bi-info'></i>
                            <i className='text-primary p-2 bi bi-map'></i>
                            <i className='text-primary p-2 bi bi-play-btn-fill'></i>
                            <i className='text-primary p-2 bi bi-calendar-plus'></i>
                        </div>
                    </button>:null}
                    <button className='btn' type='button' title={trans('Intention de prière')} onClick={()=>this.send('prayer')}>
                        <i className='kto-mass display-1 text-secondary'></i><br/>
                        {trans('Iarahana mivavaka')}<br/>
                        <div>
                            <i className='text-primary p-2 bi bi-play-btn-fill'></i>
                            <i className='text-primary p-2 bi bi-calendar-plus'></i>
                        </div>
                    </button>
                    <button className='btn' type='button' title={trans('Intention de prière')} onClick={()=>this.send('prayer')}>
                        <i className='kto-mass display-1 text-secondary'></i><br/>
                        {trans('Angatahana vavaka')}<br/>
                        <div>
                            <i className='text-primary p-2 bi bi-play-btn-fill'></i>
                        </div>
                    </button>
                    <button className='btn' type='button' title={trans('Actu/Annonce/Agenda')} onClick={()=>this.send('announce')}>
                        <i className='bi bi-calendar2-plus display-1 text-secondary'></i><br/>
                        {trans('Fiantsoana')}<br/>
                        <div>
                            <i className='text-primary p-2 bi bi-calendar-plus'></i>
                        </div>
                    </button>
                    <button className='btn' type='button' title={trans('Remerciements')} onClick={()=>this.send('thanks')}>
                        <i className='kto-pray display-1 text-secondary'></i><br/>
                        {trans('Fisaorana')}<br/>
                        <div>
                            <i className='text-primary p-2 bi bi-play-btn-fill'></i>
                        </div>
                    </button>
                    <button className='btn' type='button' title={trans('Saint Quotation')} onClick={()=>this.send('quotation')}>
                        <i className='bi bi-calendar2-plus display-1 text-secondary'></i><br/>
                        {trans('Fizarana')}<br/>
                        <div>
                            <i className='text-primary p-2 bi bi-play-btn-fill'></i>
                        </div>
                    </button>
                    <button className='btn' type='button' title={trans('A vendre')} onClick={()=>this.send('product')}>
                        <i className='bi bi-currency-exchange display-1 text-secondary'></i><br/>
                        {trans('Amidy')}<br/>
                        <div>
                            <i className='text-primary p-2 bi bi-info'></i>
                            <i className='text-primary p-2 bi bi-cart-plus'></i>
                        </div>
                    </button>
                </div>:null}
            </div>
        </React.Fragment>
    }
}

export default Modelizer(Form1)