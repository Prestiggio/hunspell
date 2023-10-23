import React, {Component} from 'react';
import Modelizer from 'Core/Modelizer';
import store from 'Core/Store';

class SearchEngine extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            data: this.models('props.data.data.results', [])
        }
        this.dismiss = this.dismiss.bind(this)
    }

    dismiss(selection) {
        store.dispatch({
            selection,
            type: 'selected',
            id: this.props.data.id
        })
    }

    render() {
        return <React.Fragment>
            <div className="modal-header">
                <h5 className="modal-title">{this.models('props.data.s')}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className='row'>
                    {this.state.data.map(image=><div className='col-md-4' key={image.url} onClick={()=>this.dismiss(image)}>
                        <img src={image.img_src} className='img-thumbnail'/>
                    </div>)}
                </div>
            </div>
        </React.Fragment>
    }
}

export default Modelizer(SearchEngine)