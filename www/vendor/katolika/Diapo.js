import React, {Component} from 'react';
import readingTime from "reading-time/lib/reading-time";
import anime from 'animejs';

const Content = `
Ento ny jiogako,
Mianara Amiko,
Fa malemy fanahy Aho
Ka hahita fiadanana ianao`

class Diapo extends Component
{
    constructor(props) {
        super(props)
        this.container = React.createRef()
        const ar = Content.split(/\r?\n/)
        let lines = []
        let delay = 0
        ar.map(it=>{
            const rt = readingTime(it, {
                wordsPerMinute: 60
            })
            lines.push({
                text: it,
                delay,
                duration: 6000
            })
            delay+= rt.time
        })
        this.state = {
            lines
        }
    }

    componentDidMount() {
        anime({
            targets: this.container.current.querySelectorAll('div'),
            opacity: [0, 1],
            delay: (el, index)=>{
                return this.state.lines[index].delay
            },
            duration: (el, index)=>{
                return this.state.lines[index].duration
            }
        })
    }

    render() {
        return <div ref={this.container} className={this.props.className}>
            {this.state.lines.map((line, index)=><div key={`line${index}`} className="text-right">{line.text}</div>)}
        </div>
    }
}

export default Diapo;