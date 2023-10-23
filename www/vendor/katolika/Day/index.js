import React, {Component, Suspense} from 'react';
import Loading from 'Components/Loading';
import Modelizer from 'Core/Modelizer';

class MediaChooser extends Component
{
    static id = 'Day-Medias-Edit';

    render() {
        const It = React.lazy(()=>import('./MediaChooser'))
        return <Suspense fallback={<Loading/>}>
            <It data={this.props.data}>
                {this.props.children}
            </It>
        </Suspense>
    }
}

Modelizer(MediaChooser)

class SearchEngine extends Component
{
    static id = 'SearchEngine';

    render() {
        const It = React.lazy(()=>import('./SearchEngine'))
        return <Suspense fallback={<Loading/>}>
            <It data={this.props.data}>
                {this.props.children}
            </It>
        </Suspense>
    }
}

Modelizer(SearchEngine)