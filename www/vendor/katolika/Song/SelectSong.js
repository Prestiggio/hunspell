import React, {Component} from 'react';
import Song from './index';
import {WEAPI} from 'katolika/User/Model';

class SelectSong extends Component
{
    constructor(props) {
        super(props)
        this.index = 1
        this.state = {
            suggestions: [],
            data: [{
                id: `song-${this.props.model}-${this.index}`
            }]
        }
        this.add = this.add.bind(this)
        this.remove = this.remove.bind(this)
    }

    componentDidMount() {
        WEAPI(api=>{
            api.db.autocomplete('songs', {
                name: {
                    '$regex': ''
                },
                tags: [this.props.model],
                celebration: this.props.celebration
            }, true).then(result=>{
                if(result.docs.length>0) {
                    this.setState({
                        suggestions: result.docs
                    })
                }
            })
        })
    }

    add() {
        this.index++
        this.setState(state=>{
            state.data.push({
                id: `song-${this.props.model}-${this.index}`
            })
            return state
        })
    }

    remove(song) {
        this.setState(state=>{
            state.data = state.data.filter(it=>it.id!=song.id)
            return state
        })
    }

    render() {
        return <div className='mb-3'>
            {this.state.data.map((song, index)=><Song key={`song-${song.id}`} suggestions={this.state.suggestions} model={this.props.model} required={this.props.required} title={this.props.title} data={song} add={this.add} remove={()=>this.remove(song)} recitable={this.props.recitable} multiple={this.props.multiple} isLast={index==this.state.data.length-1}/>)}
        </div>
    }
}

export default SelectSong;