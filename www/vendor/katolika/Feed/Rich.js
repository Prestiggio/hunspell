import React, {Component} from 'react';
import Form from 'Core/Form';
import trans from 'Core/translations';
import {Input} from 'katolika/Form';
import Modelizer from 'Core/Modelizer';
import { LiturgyBuilder } from '../Mass/Liturgy';
import Church from 'katolika/Church/Form';

class Rich extends Component
{
    render() {
        return <Form action="/admin/event/schedule/liturgy" method="post" name="frm_liturgy" id="frm_liturgy" >
            <Church name={`church`} id={`church`} placeholder="&#xF52A; Toerana" onSelect={this.handleChurchChange}/>
            <LiturgyBuilder data={this.props.data} actions={
                <React.Fragment>
                    <button className='btn btn-primary'>{trans('Vakiraoka')}</button>
                    <button className='btn btn-primary'>{trans('Zarao')}</button>
                    <button className='btn btn-primary'>{trans('Avoaka DOCX')}</button>
                </React.Fragment>
            }/>
        </Form>
    }
}

export default Modelizer(Rich)