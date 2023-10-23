import React, {Component} from 'react';
import Modelizer from 'Core/Modelizer';
import PictureEditor from 'Core/PictureEditor';

class Celebration extends Component
{
    render() {
        return <div className='row m-0 py-2' style={{background:this.models('props.data.image.accent_color')}}>
            {this.models('props.data.image.thumbnail.url')?<div className='col-md-4'><PictureEditor name="thumbnail" src={this.models('props.data.image.thumbnail.url')}/></div>:null}
            <div className={this.models('props.data.image.thumbnail.url')?'col':''}>
                {this.props.children}
            </div>
        </div>
    }
}

export default Modelizer(Celebration)