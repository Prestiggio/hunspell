import React, { Component } from 'react';
import trans from 'Core/translations';
import World from './world';
import Modelizer from 'Core/Modelizer';

class ParoisseDashboard extends Component
{
    async componentDidMount() {
        const paroisse = await World.paroisse.show(this.props.paroisseId)
        this.setState({
            paroisse
        })
    }

    render() {
        return <div className="container my-5">
            <h1 className="border-bottom my-5 pb-3 text-primary border-primary">{trans('Paroisse :name', {name: this.models('state.paroisse.name')})}</h1>
            <a className="btn btn-primary" href={`/admin/missionnaires/${this.props.paroisseId}`}>Missionnaires</a>
            <a className="btn btn-primary" href={`/admin/baptemes/${this.props.paroisseId}`}>Registre de baptêmes</a>
        </div>
    }
}

export default Modelizer(ParoisseDashboard);