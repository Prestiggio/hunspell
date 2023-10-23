import React, {Component} from 'react';
import Modelizer from 'Core/Modelizer';
import store from 'Core/Store';
import {refetch} from 'Core/Ry';
import trans from 'Core/translations';

class Suggestion extends Component
{
    componentDidMount() {
        const now = this.props.data.date
        refetch(`/admin/event/schedule/day?dt=${now.format('YYYY-MM-DD-HH-mm-ss')}`).then(data=>{
            this.setState({data})
            store.dispatch({
                type : 'day_ready',
                hour : data.liturgy.hour.title
            })
        })
    }

    render() {
        return <div>{trans('suggestion de AELF')}</div>
    }
}

class AELFSuggestions extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            suggestions: [{
                id: 'aelf',
                date: this.props.date
            }]
        }
    }

    render() {
        return this.state.suggestions.map(suggestion=><Suggestion key={suggestion.id} data={suggestion}/>)
    }
}

export default Modelizer(AELFSuggestions)