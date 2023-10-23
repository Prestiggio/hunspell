import React, {Component} from 'react';
import Modelizer from 'Core/Modelizer';
import trans from 'Core/translations';

class List extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            data: this.models('props.data.data.data', [])
        }
    }

    render() {
        return <div className='card'>
            <div className='card-body'>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>{trans('Anarana')}</th>
                            <th>{trans('APV')}</th>
                            <th>{trans('Faritra')}</th>
                            <th></th>
                            <th></th>
                        </tr>
                        <tr>
                            <td>
                                <input type="search" className="form-control" onChange={e=>this.handleChange(e, 'name')}/>
                            </td>
                            <td>
                                <input type="search" className="form-control" onChange={e=>this.handleChange(e, 'apv.name')}/>
                            </td>
                            <td>
                                <input type="search" className="form-control" onChange={e=>this.handleChange(e, 'apv.faritra.name')}/>
                            </td>
                            <td>
                                <button className='btn btn-secondary' type="button" onClick={this.search}><i className='bi bi-search'></i></button>
                            </td>
                            <td>
                                <a className='btn btn-secondary' href='#dialog/admin/users/create'><i className='bi bi-plus'></i></a>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(item => <tr key={item.id}>
                            <td>{this.cast(item, 'name')}</td>
                            <td>{this.cast(item, 'apv.name')}</td>
                            <td>{this.cast(item, 'apv.faritra.name')}</td>
                            <td><a className='btn btn-secondary' href={`#dialog/admin/users/${item.id}/edit`} data-display="modal-xl"><i className='bi bi-pen-fill'></i></a></td>
                            <td><button className='btn btn-danger' type='button' onClick={()=>this.remove(item)}><i className='bi bi-trash-fill'></i></button></td>
                        </tr>)}
                    </tbody>
                </table>
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center">
                        {this.props.data.data.links.map(link=><li key={link.url} className={`page-item ${link.active?'active':''}`}><a className="page-link" href={link.url}>{link.label}</a></li>)}
                    </ul>
                </nav>
            </div>
        </div>
    }
}

export default Modelizer(List);