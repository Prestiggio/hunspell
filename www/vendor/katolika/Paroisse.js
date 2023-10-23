import React, {Component} from 'react';
import Modelizer from 'Core/Modelizer';
import trans from 'Core/translations';
import World from './world';
import store from 'Core/Store';

const db = openDatabase('katolika', '1.0', 'Katolika DB', 2*1024*1024);

class Paroisse extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            edition_mode : false,
            name : this.props.data.name
        }
        this.input = React.createRef()
        this.edit = this.edit.bind(this)
        this.remove = this.remove.bind(this)
        this.save = this.save.bind(this)
    }

    save() {
        const name = $(this.input.current).val()
        World.paroisse.update({name}, this.props.data.id).then(()=>{
            this.setState({
                edition_mode: false,
                name
            })
        })
    }

    edit() {
        this.setState({
            edition_mode: true
        })
    }

    remove() {
        store.dispatch({type:'delete_paroisse', id:this.props.data.id})
    }

    render() {
        return <div className="flex-column align-items-start mx-5 w-auto">
            <div className="small text-secondary">Paroisse</div>
            <div className="d-flex justify-content-between">
                {this.state.edition_mode?<div className="form-floating flex-fill">
                    <input ref={this.input} type="text" defaultValue={this.props.data.name} className="form-control" placeholder={trans('Nom de la paroisse')}/>
                    <label className="control-label">{trans('Nom de la paroisse')}</label>
                </div>:<h5><a href={`/admin/paroisses/${this.props.data.id}`}>{this.state.name}</a></h5>}
                <div>
                    {this.state.edition_mode?<button className="btn" type="button" onClick={this.save}><i className="bi bi-check2"></i></button>:<button className="btn" type="button" onClick={this.edit}><i className="bi bi-pencil"></i></button>}
                    <button className="btn" type="button" onClick={this.remove}><i className="bi bi-trash"></i></button>
                </div>
            </div>
        </div>
    }
}

Modelizer(Paroisse)

class District extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            paroisses : this.props.data.paroisses
        }
        this.input = React.createRef()
        this.addParoisse = this.addParoisse.bind(this)
    }

    componentDidMount() {
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type=='delete_paroisse') {
                this.setState(state=>{
                    state.paroisses = state.paroisses.filter(it=>it.id!=storeState.id)
                    return state
                })
            }
        })
    }

    addParoisse() {
        if(this.input.current.checkValidity()) {
            db.transaction(tx=>{  
                tx.executeSql(`INSERT INTO paroisses (name, district_id) VALUES (?, ?)`, [$(this.input.current).val(), parseInt(this.props.data.id)], tx=>{
                    tx.executeSql(`SELECT rowid, name FROM paroisses WHERE district_id = ?`, [parseInt(this.props.data.id)], (tx, results)=>{
                        const paroisses = []
                        for(let i=0; i<results.rows.length; i++) {
                            paroisses.push({
                                id : results.rows.item(i).rowid,
                                name : results.rows.item(i).name
                            })
                        }
                        this.setState({paroisses})
                        $(this.input.current).val('')
                    })
                })
            });
        }
    }

    render() {
        return <div className="flex-column align-items-start mx-5 w-auto">
            <div className="small text-secondary">District</div>
        <h5 className="mb-1 border-bottom">{this.props.data.name}</h5>
            <div className="list-group">
                {this.state.paroisses.map(paroisse=><Paroisse key={paroisse.id} data={paroisse}/>)}
                <div className={`input-group align-items-center mx-5 mb-3`}>
                    <input ref={this.input} type="text" required className={`form-control`} placeholder={trans("Nouvelle paroisse")}/>
                    <button className="btn" type="button" onClick={this.addParoisse}><i className="bi bi-plus-square-dotted"></i></button>
                    <div className="invalid-feedback">
                        {trans('Veuillez renseigner le nom de la paroisse')}
                    </div>
                </div>
            </div>
        </div>
    }
}

class Vicariat extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            districts : this.props.data.districts
        }
        this.input = React.createRef()
        this.addDistrict = this.addDistrict.bind(this)
    }

    addDistrict() {
        if(this.input.current.checkValidity()) {
            db.transaction(tx=>{  
                tx.executeSql(`INSERT INTO districts (name, vicariat_id) VALUES (?, ?)`, [$(this.input.current).val(), parseInt(this.props.data.id)], tx=>{
                    tx.executeSql(`SELECT rowid, name FROM districts WHERE vicariat_id = ?`, [parseInt(this.props.data.id)], (tx, results)=>{
                        const districts = []
                        for(let i=0; i<results.rows.length; i++) {
                            districts.push({
                                id : results.rows.item(i).rowid,
                                name : results.rows.item(i).name,
                                paroisses : []
                            })
                        }
                        this.setState({districts})
                        $(this.input.current).val('')
                    })
                })
            });
        }
    }

    render() {
        return <div className="flex-column align-items-start mx-5 w-auto">
            <div className="small text-secondary">Vicariat</div>
        <h5 className="mb-1 border-bottom">{this.props.data.name}</h5>
            <div className="list-group">
                {this.state.districts.map(district=><District key={district.id} data={district}/>)}
                <div className={`input-group align-items-center mx-5 mb-3`}>
                    <input ref={this.input} type="text" required className={`form-control`} placeholder={trans("Nouveau district")}/>
                    <button className="btn" type="button" onClick={this.addDistrict}><i className="bi bi-plus-square-dotted"></i></button>
                    <div className="invalid-feedback">
                        {trans('Veuillez renseigner le nom du district')}
                    </div>
                </div>
            </div>
        </div>
    }
}

class Diocese extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            vicariats : this.props.data.vicariats
        }
        this.input = React.createRef()
        this.addVicariat = this.addVicariat.bind(this)
    }

    addVicariat() {
        if(this.input.current.checkValidity()) {
            db.transaction(tx=>{  
                tx.executeSql(`INSERT INTO vicariats (name, diocese_id) VALUES (?, ?)`, [$(this.input.current).val(), parseInt(this.props.data.id)])
                db.transaction(tx=>{
                    tx.executeSql(`SELECT rowid, name FROM vicariats WHERE diocese_id = ?`, [parseInt(this.props.data.id)], (tx, results)=>{
                        const vicariats = []
                        for(let i=0; i<results.rows.length; i++) {
                            vicariats.push({
                                id : results.rows.item(i).rowid,
                                name : results.rows.item(i).name,
                                districts : []
                            })
                        }
                        this.setState({vicariats})
                        $(this.input.current).val('')
                    })
                })
            });
        }
    }

    render() {
        return <div className="flex-column align-items-start mx-5 w-auto">
            <div className="small text-secondary">Diocèse</div>
        <h5 className="mb-1 border-bottom">{this.props.data.name}</h5>
            <div className="list-group">
                {this.state.vicariats.map(vicariat=><Vicariat key={vicariat.id} data={vicariat}/>)}
                <div className={`input-group align-items-center mx-5 mb-3`}>
                    <input ref={this.input} type="text" required className={`form-control`} placeholder={trans("Nouveau vicariat")}/>
                    <button className="btn" type="button" onClick={this.addVicariat}><i className="bi bi-plus-square-dotted"></i></button>
                    <div className="invalid-feedback">
                        {trans('Veuillez renseigner le nom du vicariat')}
                    </div>
                </div>
            </div>
        </div>
    }
}

class Province extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            dioceses : this.props.data.dioceses
        }
        this.input = React.createRef()
        this.addDiocese = this.addDiocese.bind(this)
    }

    addDiocese() {
        if(this.input.current.checkValidity()) {
            db.transaction(tx=>{  
                tx.executeSql(`INSERT INTO dioceses (name, province_id) VALUES (?, ?)`, [$(this.input.current).val(), parseInt(this.props.data.id)], tx=>{
                    tx.executeSql(`SELECT rowid, name FROM dioceses WHERE province_id = ?`, [parseInt(this.props.data.id)], (tx, results)=>{
                        const dioceses = []
                        for(let i=0; i<results.rows.length; i++) {
                            dioceses.push({
                                id : results.rows.item(i).rowid,
                                name : results.rows.item(i).name,
                                vicariats : []
                            })
                        }
                        this.setState({dioceses})
                        $(this.input.current).val('')
                    })
                })
            });
        }
    }

    render() {
        return <div className="flex-column align-items-start mx-5 w-auto">
            <div className="small text-secondary">Province</div>
        <h5 className="mb-1 border-bottom">{this.props.data.name}</h5>
            <div className="list-group">
                {this.state.dioceses.map(diocese=><Diocese key={diocese.id} data={diocese}/>)}
                <div className={`input-group align-items-center mx-5 mb-3`}>
                    <input ref={this.input} type="text" required className={`form-control`} placeholder={trans("Nouveau diocèse")}/>
                    <button className="btn" type="button" onClick={this.addDiocese}><i className="bi bi-plus-square-dotted"></i></button>
                    <div className="invalid-feedback">
                        {trans('Veuillez renseigner le nom du diocèse')}
                    </div>
                </div>
            </div>
        </div>
    }
}

class Region extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            provinces : this.props.data.provinces
        }
        this.input = React.createRef()
        this.addProvince = this.addProvince.bind(this)
    }

    addProvince() {
        if(this.input.current.checkValidity()) {
            db.transaction(tx=>{  
                tx.executeSql(`INSERT INTO provinces (name, region_id) VALUES (?, ?)`, [$(this.input.current).val(), parseInt(this.props.data.id)], tx=>{
                    tx.executeSql(`SELECT rowid, name FROM provinces WHERE region_id = ?`, [parseInt(this.props.data.id)], (tx, results)=>{
                        const provinces = []
                        for(let i=0; i<results.rows.length; i++) {
                            provinces.push({
                                id : results.rows.item(i).rowid,
                                name : results.rows.item(i).name,
                                dioceses : []
                            })
                        }
                        this.setState({provinces})
                        $(this.input.current).val('')
                    })
                })
            });
        }
    }

    render() {
        return <div className="flex-column align-items-start mx-5 w-auto">
            <div className="small text-secondary">Région</div>
        <h5 className="mb-1 border-bottom">{this.props.data.name}</h5>
        <div className="list-group">
            {this.state.provinces.map(province=><Province key={province.id} data={province}/>)}
            <div className={`input-group align-items-center mx-5 mb-3`}>
                <input ref={this.input} type="text" required className={`form-control`} placeholder={trans("Nouvelle province")}/>
                <button className="btn" type="button" onClick={this.addProvince}><i className="bi bi-plus-square-dotted"></i></button>
                <div className="invalid-feedback">
                    {trans('Veuillez renseigner le nom de la province')}
                </div>
            </div>
        </div>
    </div>
    }
}

class Country extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            regions : this.props.data.regions
        }
        this.input = React.createRef()
        this.addRegion = this.addRegion.bind(this)
    }

    addRegion() {
        if(this.input.current.checkValidity()) {
            db.transaction(tx=>{  
                tx.executeSql(`INSERT INTO regions (name, country_id) VALUES (?, ?)`, [$(this.input.current).val(), this.props.data.id], tx=>{
                    tx.executeSql(`SELECT rowid, name FROM regions WHERE country_id = ?`, [this.props.data.id], (tx, results)=>{
                        const regions = []
                        for(let i=0; i<results.rows.length; i++) {
                            regions.push({
                                id : results.rows.item(i).rowid,
                                name : results.rows.item(i).name,
                                provinces : []
                            })
                        }
                        this.setState({regions})
                        $(this.input.current).val('')
                    })
                })
            });
        }
    }

    render() {
        return <div className="flex-column align-items-start mx-5 w-auto">
        <div className="small text-secondary">Pays</div>
        <h5 className="mb-1 border-bottom">{this.props.data.flag} {this.props.data.name}</h5>
        <div className="list-group">
            {this.state.regions.map(region=><Region key={region.id} data={region}/>)}
            <div className={`input-group align-items-center mx-5 mb-3`}>
                <input ref={this.input} type="text" required className={`form-control`} placeholder={trans("Nouvelle région")}/>
                <button className="btn" type="button" onClick={this.addRegion}><i className="bi bi-plus-square-dotted"></i></button>
                <div className="invalid-feedback">
                    {trans('Veuillez renseigner le nom de la région')}
                </div>
            </div>
        </div>
    </div>
    }
}

class Continent extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            countries : this.props.data.countries,
            country_id : 'MG'
        }
    }

    componentDidMount() {
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type=='filter_country') {
                this.setState({
                    country_id : storeState.country_id
                })
            }
        })
    }

    render() {
        return <div className="flex-column align-items-start">
            <div className="small text-secondary">Continent</div>
            <h5 className="mb-1 border-bottom">{this.props.data.name}</h5>
            <div className="list-group">
                {this.props.data.countries.filter(it=>it.id==this.state.country_id).map(country=><Country key={`${this.props.pkey}-${country.id}`} data={country}/>)}
            </div>
        </div>
    }
}

class Structure extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            continents : [],
            continent_id : 0,
            country_id : 0
        }
        this.handleContinent = this.handleContinent.bind(this)
        this.handleCountry = this.handleCountry.bind(this)
    }

    handleContinent(event) {
        const continent_id = event.target.value
        this.setState({
            continent_id
        })
    }

    handleCountry(event) {
        const country_id = event.target.value
        this.setState({
            country_id
        })
        store.dispatch({type:'filter_country', country_id})
    }

    async componentDidMount() {
        const continents = await World.getContinents()
        const continent_id = continents[0].id
        const country_id = continents[0].countries.find(it=>it.id=='MG').id
        this.setState({
            continents,
            continent_id,
            country_id
        })
    }

    render() {
        return <div className="container my-4">
            <h1 className="border-bottom my-5 pb-3 text-primary border-primary">{trans('Ajouter une paroisse')}</h1>
            <div className="card mb-4">
                <div className="card-body">
                    <div className="form-group mb-3">
                        <label className="control-label" htmlFor="s_continent">{trans('Sélectionner le continent')}</label>
                        <select className="form-select" id="s_continent" onChange={this.handleContinent} value={this.state.continent_id}>
                            {this.state.continents.map(continent=><option key={`continent-${continent.id}`} value={continent.id}>{continent.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group mb-3">
                        <label className="control-label" htmlFor="s_country">{trans('Sélectionner le pays')}</label>
                        <select className="form-select" id="s_country" onChange={this.handleCountry} value={this.state.country_id}>
                            {this.cast(this.state.continents.find(it=>it.id==this.state.continent_id), 'countries', []).map(country=><option key={`country-${country.id}`} value={country.id}>{country.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <form method="post" className="needs-validation" action="/admin/paroisse" ref={this.form} noValidate>
                        <div className="list-group">
                            {this.state.continents.filter(it=>it.id==this.state.continent_id).map(continent=><Continent key={continent.id} pkey={continent.id} data={continent}/>)}
                        </div>
                    </form>   
                </div>
            </div>
        </div>
    }
}

export default Modelizer(Structure);