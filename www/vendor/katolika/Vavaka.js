import React, {Component} from 'react';
import Editable from 'Core/Editable';
import {Vavaka as VavakaItem} from 'katolika/Prayers';
import store from 'Core/Store';

class Vavaka extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            prayerresults : [],
            links: []
        }
    }

    componentDidMount() {
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type==='vavaka_results') {
                this.setState({
                    prayerresults: storeState.data.data,
                    links : storeState.data.links
                })
            }
        })
    }

    render() {
        return <div className="container my-3" ref={el => this.setEditable(el, 'tab-prayer')}>
            
        </div>
    }
}

export default Editable(Vavaka)