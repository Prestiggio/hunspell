import React, {Component} from 'react';
import trans from 'Core/translations';
import Modelizer from 'Core/Modelizer';
import SelectSong from 'katolika/Song/SelectSong';
import Step from 'katolika/Liturgy/Step';

class Mass extends Component
{
    render() {
        return <div className='card my-1'>
            <div className='card-body'>
                <SelectSong required title={trans('Hira fidirana')} model="fidirana" celebration={this.props.celebration} moveable={true} multiple={this.models('props.celebration.procession')}/>
                {this.models('props.celebration.bapteme')?null:<SelectSong required title={trans('Fifonana')} model="fifonana" celebration={this.props.celebration} recitable={true}/>}
                {this.props.season!=='lent'?<SelectSong title={trans('Voninahitra')} model="voninahitra" celebration={this.props.celebration} moveable={true} recitable={true}/>:null}
                <SelectSong title={trans("Fitsenana ny tenin'Andriamanitra")} model="fitsenanaTA" celebration={this.props.celebration} moveable={true}/>
                {this.models('props.data.steps', []).filter(it=>it.id==='reading1').map(step=><Step key={`step-${step.id}`} data={step}/>)}
                <SelectSong required title={trans("Setrin'ny tenin'Andriamanitra")} model="setriny" celebration={this.props.celebration} recitable={true}/>
                {this.models('props.data.steps', []).filter(it=>it.id==='psalm').map(step=><Step key={`step-${step.id}`} data={step}/>)}
                {this.models('props.data.steps', []).filter(it=>it.id==='reading2').map(step=><Step key={`step-${step.id}`} data={step}/>)}
                {this.models('props.data.steps', []).filter(it=>it.id==='reading3').map(step=><Step key={`step-${step.id}`} data={step}/>)}
                {this.models('props.data.steps', []).filter(it=>it.id==='reading4').map(step=><Step key={`step-${step.id}`} data={step}/>)}
                <SelectSong required title={trans("Fihobiana ny Evanjely")} model={`aleloia/${this.props.season}`} celebration={this.props.celebration}/>
                {this.models('props.data.steps', []).filter(it=>it.id==='gospel').map(step=><Step key={`step-${step.id}`} data={step}/>)}
                <SelectSong title={trans("Fiekem-pinoana")} model="credo" celebration={this.props.celebration} recitable={true} moveable={true}/>
                <SelectSong title={trans("Ranombavaky ny mpino")} model="ranombavaka" celebration={this.props.celebration} multiple={true}/>
                <SelectSong title={trans("Rakitra")} model="rakitra" celebration={this.props.celebration} multiple={true}/>
                <SelectSong moveable={true} title={trans("Fanaterana fanatitra")} model="fanatitra" celebration={this.props.celebration}/>
                <SelectSong required title={trans("Fanolorana")} model="fanolorana" celebration={this.props.celebration} recitable={true}/>
                <SelectSong required moveable={true} title={trans("Masina")} model="masina" celebration={this.props.celebration} recitable={true}/>
                <SelectSong required title={trans("Fihobiana")} model="anamnese" celebration={this.props.celebration} recitable={true}/>
                <SelectSong required title={trans("Rainay")} model="rainay" celebration={this.props.celebration} recitable={true}/>
                <SelectSong title={trans("Fiadanana")} model="fiadanana" celebration={this.props.celebration} moveable={true}/>
                <SelectSong required title={trans("Zanak'ondry")} model="zanakondry" celebration={this.props.celebration} recitable={true}/>
                <SelectSong required title={trans("Komonio")} model="komonio" celebration={this.props.celebration} multiple={true}/>
                <SelectSong moveable={true} title={trans("Fisaorana")} model="fisaorana" celebration={this.props.celebration} multiple={true}/>
                {this.props.celebration.id==='absoute'?<SelectSong required title={trans("Absoute")} model="absoute" multiple={true}/>:null}
                {this.props.celebration.id==='wedding'?<SelectSong required title={trans("Fanateram-boninkazo")} model="mariale"/>:null}
                <SelectSong required title={trans("Fanirahana")} model="fanirahana" celebration={this.props.celebration}/>
            </div>
        </div>
    }
}

export default Modelizer(Mass)