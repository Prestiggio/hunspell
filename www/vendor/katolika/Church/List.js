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
                            <th>{trans('Paroasy')}</th>
                            <th>{trans('Distrika')}</th>
                            <th>{trans('Diosezy')}</th>
                            <th></th>
                            <th></th>
                        </tr>
                        <tr>
                            <td>
                                <input type="search" className="form-control" onChange={e=>this.handleChange(e, 'name')}/>
                            </td>
                            <td>
                                <input type="search" className="form-control" onChange={e=>this.handleChange(e, 'district.name')}/>
                            </td>
                            <td>
                                <input type="search" className="form-control" onChange={e=>this.handleChange(e, 'district.diocese.name')}/>
                            </td>
                            <td>
                                <button className='btn btn-secondary' type="button" onClick={this.search}><i className='bi bi-search'></i></button>
                            </td>
                            <td>

                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(item => <tr key={item.id}>
                            <td>{this.cast(item, 'saint.prefix')} {this.cast(item, 'saint.name')} {this.cast(item, 'name')}</td>
                            <td>{this.cast(item, 'district.name')}</td>
                            <td>{this.cast(item, 'district.diocese.name')}</td>
                            <td><a className='btn' href={`/admin/churches/${item.id}/edit`}><i className='bi bi-pen-fill'></i></a></td>
                            <td><a className='btn btn-secondary' href={`#dialog/admin/rooms?adresse_id=${item.adresse_id}`} data-display="modal-xl">{trans('Fandaminana efitrano')}</a></td>
                        </tr>)}
                    </tbody>
                </table>
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center">
                        <li className="page-item">
                            <button className="page-link" type='button' onClick={this.loadPrevious}>Previous</button>
                        </li>
                        <li className="page-item"><a className="page-link" href="#">1</a></li>
                        <li className="page-item"><a className="page-link" href="#">2</a></li>
                        <li className="page-item"><a className="page-link" href="#">3</a></li>
                        <li className="page-item">
                            <button className="page-link" type='button' onClick={this.loadNext}>Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    }
}

export default Modelizer(List)