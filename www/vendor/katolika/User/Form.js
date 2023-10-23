import React, {Component} from 'react';
import Modelizer from 'Core/Modelizer';
import trans from 'Core/translations';
import { CFormSwitch } from '@coreui/react';

class Form extends Component
{
    render() {
        return <div>
            <div className='form-group'>
                <label className='control-label'>{trans('Auto-valider ses publications')}</label>
                <CFormSwitch label="Checked switch checkbox input" id="formSwitchCheckChecked" defaultChecked/>
            </div>
        </div>
    }
}

export default Modelizer(Form);