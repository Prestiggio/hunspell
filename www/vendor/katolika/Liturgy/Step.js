import React, {Component} from 'react';
import Modelizer from 'Core/Modelizer';
import {WEAPI} from 'katolika/User/Model';
import { Andininy } from 'katolika/Baiboly';
import store from 'Core/Store';

class Step extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            verses: []
        }
    }

    componentDidMount() {
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type===this.props.data.parent_id) {
                this.setState(state=>{
                    if(this.props.data.id==='content') {
                        state.verses = storeState.verses
                    }
                    state.info = storeState.info
                    return state
                })
            }
        })
        if(this.props.data.id==='reference') {
            WEAPI(api=>{
                api.db.paginate('books', {
                    name: {
                        '$regex': ''
                    },
                    reference: this.props.data.content
                }, true).then(result=>{
                    store.dispatch({
                        type: this.props.data.parent_id,
                        verses: result.docs,
                        info: result.info
                    })
                })
            })
        }
    }

    render() {
        const ACTORS = {
            liturgist: 'bi-person-circle text-secondary',
            assembly: 'bi-people-fill text-info',
            priest: 'bi-person-circle text-primary'
        }
        return <div>
            <h4>{this.models('props.data.actors', []).map(actor=><i key={`actor-${actor}`} className={`bi ${ACTORS[actor]} me-2`}></i>)} {this.models('props.data.title')}</h4>
            <h5>{this.models('props.data.label')}</h5>
            {this.state.verses.length>0?<div className='my-3'>
                {this.state.verses.map(verse => <Andininy data={verse} key={`verse${verse.id}`}/>)}
            </div>:<div dangerouslySetInnerHTML={{__html:this.models(`state.info.${this.props.data.id}`, this.models('props.data.content'))}}></div>}
            {this.models('props.data.steps', []).filter(it=>it.action==='speech').map((step, index)=><Step key={`step-${step.parent_id}-${index}`} data={step}/>)}
        </div>
    }
}

export default Modelizer(Step)