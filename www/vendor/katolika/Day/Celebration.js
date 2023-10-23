import React, {Component} from 'react';
import Modelizer from 'Core/Modelizer';
import blank from 'medias/blank.png';
import store from 'Core/Store';

class Celebration extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            options: [],
            image: this.models('props.data.image.thumbnail.url', this.models('props.data.image.url'))
        }
        this.img = React.createRef()
    }

    componentDidMount() {
        const broken = this.props.broken ? this.props.broken : blank
        $(this.img.current).on('error', function(){
            if(!this.broken) {
                this.src = broken;
                this.broken = true;
            }
        });
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type==='selected' && 'selection' in storeState && storeState.id==this.props.pkey) {
                this.setState({
                    image: storeState.selection.img_src
                }, ()=>{
                    setTimeout(()=>{
                        store.dispatch({
                            type: 'dialog.dismiss'
                        })
                    }, 100)
                })
            }
        })
    }

    render() {
        return <div className='row'>
            <div className='col-md-3'>
                {this.state.image?<img ref={this.img} loading="lazy" src={this.state.image} className="img-fluid"/>:null}
            </div>
            <div className="col-md-9">
                <div>{this.props.data.title}</div>
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Image URL" name={`celebrations[${this.props.pkey}][url]`} value={this.state.image}/>
                    <a className="btn btn-outline-secondary" href={`#dialog/admin/search?s=${this.props.data.title}&id=${this.props.pkey}`} data-display="modal-xl">Autre</a>
                </div>
            </div>
        </div>
    }
}

export default Modelizer(Celebration)