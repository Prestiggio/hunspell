import React, {Component} from 'react';
import Celebration from './Celebration';
import Modelizer from 'Core/Modelizer';
import Form from 'Core/Form';

class MediaChooser extends Component
{
    render() {
        return <Form method="post" action="/admin/days/medias/update">
            {this.models('props.data.day.liturgy.info.celebrations', []).map((celebration, index)=><Celebration key={index} pkey={index} data={celebration}/>)}
        </Form>
    }
}

export default Modelizer(MediaChooser);