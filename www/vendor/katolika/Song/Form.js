import React, {Component} from "react";
import KaraokeEditor from "./KaraokeEditor";
import Modelizer from 'Core/Modelizer';

class Form extends Component
{
    render() {
        return <KaraokeEditor data={this.models('props.data.data')}/>
    }
}

export default Modelizer(Form)