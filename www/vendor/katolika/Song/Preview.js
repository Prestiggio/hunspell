import React, {Component} from 'react';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt()

class SongPreview extends Component
{
    truncate(content) {
        if (!content)
            return
        if (content.length < 120)
            return md.render(content)
        return md.render(content.slice(0, 120) + '...')
    }

    render() {
        return <div>
            <strong>{this.props.data.title}</strong>
            <div className='ps-3 fs-6 fst-italic' dangerouslySetInnerHTML={{__html:this.truncate(this.props.data.content)}}></div>
        </div>
    }
}

export default SongPreview