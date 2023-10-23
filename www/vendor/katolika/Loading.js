import React, {Component} from 'react';
import img from 'medias/Eclipse-1s-200px.gif';

class Loading extends Component
{
    render() {
        return <img src={img} width={30}/>
    }
}

export default Loading