import React, {Component, Suspense} from 'react';
import Modelizer from 'Core/Modelizer';
import Loading from 'katolika/Loading';

class List extends Component
{
    static id = 'Church.List'

    render() {
        const It = React.lazy(()=>import('katolika/Church/List'))
        return <Suspense fallback={<Loading/>}>
            <It data={this.props.data}/>
        </Suspense>
    }
}
Modelizer(List)