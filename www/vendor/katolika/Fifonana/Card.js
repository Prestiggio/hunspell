import React, { Component } from 'react';
import trans from 'Core/translations';
import Modelizer from 'Core/Modelizer';
import auth from 'katolika/Auth';

/*
import Echo from 'laravel-echo';

window.Pusher = require('pusher-js');

let laravelEcho = new Echo({
    broadcaster: 'pusher',
    key: '1ec7db3d-24ad-62a0-b0d1-0242ac110002',
    wsHost: '127.0.0.1',
    wsPort: 3001,
    wssPort: 3002,
    forceTLS: false,
    encrypted: true,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    cluster: 'mt1'
});

laravelEcho.private(`App.Models.User.1`)
    .listen('Flooded', (e) => {
        console.log('iny zao floooeddded fa nisy niantso');
    });
*/

const SUBSCRIBE_FORM = 1;
const SUBSCRIBE_GODPARENT = 2;
const SUBSCRIBE_WIZARD = 3;

const AGES = [
    {
        from: 0,
        label: trans('Zaza')
    },
    {
        from: 5,
        label: trans('Ankizy')
    },
    {
        from: 15,
        label: trans('Tanora')
    },
    {
        from: 25,
        label: trans('Olon-dehibe')
    }
]

class Anonymous extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data : {
                age: false,
                sakramenta: {
                    konfesy: {
                        status : 0
                    }
                }
            }
        }
        this.handleAgeChange = this.handleAgeChange.bind(this)
        this.handleKonfesy = this.handleKonfesy.bind(this)
    }

    handleKonfesy(event) {
        const value = event.target.value
        this.setState(state=>{
            state.data.sakramenta.konfesy.status = value
            return state
        })
    }

    handleAgeChange(event) {
        const value = event.target.value
        this.setState(state=>{
            state.data.age = value
            return state
        })
    }

    async componentDidMount() {
        let me = await auth.login()
        this.setState({
            me
        })
        $('form').parsley({
            errorClass: 'is-invalid',
            errorsWrapper: '<div class="invalid-tooltip"></div>',
            errorTemplate: '<div></div>'
        });
    }

    render() {
        return <div className='mb-3'>
            <div className='card border-0 shadow card-fifonana'>
                <div className='card-header d-flex justify-content-between align-items-baseline'>
                    <h6>{trans('Vavaka fifonana')}</h6>
                    <button className="btn p-0" type="button" onClick={() => document.querySelector('body').classList.remove('mifantoka-fifonana')}><i className="bi bi-x-lg"></i></button>
                </div>
                <div className='card-body'>

                </div>
                <div className='align-items-center card-footer d-flex justify-content-between border-top-0'>
                    <div>
                        <button type="button" data-bs-toggle="offcanvas" data-bs-target="#konfesy" aria-controls="konfesy" className='btn btn-primary-gradient'>{trans('Konfesy')}</button>
                    </div>
                    <div>
                        <button className='btn btn-violet-gradient mr-2' type='button'>{trans("Iombonako miaraka amin'i :olomasina", { olomasina: this.models('state.me.user.name') })}</button>
                        <img src={this.models('state.me.user.profile_photo_url')} />
                        <button className='btn btn-primary ml-2' type="button"><i className='bi bi-chat-dots'></i></button>
                    </div>
                </div>
            </div>
            <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="konfesy" aria-labelledby="konfesyLabel">
                <div className="offcanvas-body mt-5">
                    <ul className="nav nav-tabs nav-pills mb-3" id="userTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="offcanvas-login-tab" data-bs-toggle="tab" data-bs-target="#offcanvas-login" type="button" role="tab" aria-controls="offcanvas-login" aria-selected="true">{trans('Manana kaonty')}</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="offcanvas-register-tab" data-bs-toggle="tab" data-bs-target="#offcanvas-register" type="button" role="tab" aria-controls="offcanvas-register" aria-selected="false">{trans('Hanokatra kaonty')}</button>
                        </li>
                        <li className='align-self-center'>
                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </li>
                    </ul>
                    <div className="tab-content" id="OffcanvasUserTabContent">
                        <div className="tab-pane fade show active" id="offcanvas-login" role="tabpanel" aria-labelledby="offcanvas-login-tab">
                            <form method='post' action='/login' className='d-grid'>
                                <div className="form-floating mb-3">
                                    <input type="text" name="username" data-parsley-required-message={trans('Fenoy ny ID azafady')} className="form-control" required id="fifonanaLoginFloatingID" placeholder="12345678" />
                                    <label htmlFor="fifonanaLoginFloatingID">{trans('ID')}</label>
                                </div>
                                <div className="form-floating">
                                    <input type="password" name="password" className="form-control" required data-parsley-required-message={trans('Fenoy ny teny miafina azafady')} id="fifonanaLoginFloatingPassword" placeholder="Password" />
                                    <label htmlFor="fifonanaLoginFloatingPassword">{trans('Teny miafina')}</label>
                                </div>
                                <button className="btn btn-primary mt-3">{trans('Miditra')}</button>
                                <input type="hidden" name="ry"/>
                            </form>
                        </div>
                        <div className="tab-pane fade" id="offcanvas-register" role="tabpanel" aria-labelledby="offcanvas-register-tab">
                            <form method='post' action='/api/register' className='d-grid'>
                                <div className={!this.state.step?'':'d-none'}>
                                    <h6><span className='badge bg-primary rounded-pill me-2'>1</span> {trans('Indro safidy 3 azo anokafana kaonty')}</h6>
                                    <div className={`list-group`}>
                                        <button type='button' onClick={()=>this.setState({mode:SUBSCRIBE_FORM,step:1})} className={`list-group-item list-group-item-action ${this.state.mode===SUBSCRIBE_FORM?'active':''}`} aria-current={this.state.mode===SUBSCRIBE_FORM?'true':''}>
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1">{trans('Mameno formulaire')}</h5>
                                                {this.state.mode===SUBSCRIBE_FORM?<i className='bi bi-check-circle-fill text-success'></i>:null}
                                            </div>
                                            <p className="mb-1">Ianao ihany no mameno ny momba anao.</p>
                                        </button>
                                        <button type='button' onClick={()=>this.setState({mode:SUBSCRIBE_GODPARENT,step:1})} className={`list-group-item list-group-item-action ${this.state.mode===SUBSCRIBE_GODPARENT?'active':''}`} aria-current={this.state.mode===SUBSCRIBE_GODPARENT?'true':''}>
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1">{trans('Manana mpiantoka efa manana kaonty')}</h5>
                                                {this.state.mode===SUBSCRIBE_GODPARENT?<i className='bi bi-check-circle-fill text-success'></i>:null}
                                            </div>
                                            <p className="mb-1">Manan-kery ny kaontinao vantany vao manamarina ny mpiantoka anao.</p>
                                        </button>
                                        <button type='button' onClick={()=>this.setState({mode:SUBSCRIBE_WIZARD,step:1})} className={`list-group-item list-group-item-action ${this.state.mode===SUBSCRIBE_WIZARD?'active':''}`} aria-current={this.state.mode===SUBSCRIBE_WIZARD?'true':''}>
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1">{trans('Antsoinay sy raisinay an-tsoratra')}</h5>
                                                {this.state.mode===SUBSCRIBE_WIZARD?<i className='bi bi-check-circle-fill text-success'></i>:null}
                                            </div>
                                            <p className="mb-1">Dingana misimisy vao azonao ampiasaina ny kaontinao.</p>
                                        </button>
                                    </div> 
                                </div>  
                                <div className={(this.state.step===1 && (this.state.mode===SUBSCRIBE_FORM || this.state.mode===SUBSCRIBE_GODPARENT))?'':'d-none'}>
                                    <h5 className='mouse-pointable alpha-30' onClick={()=>this.setState({step:0})}><span className='badge bg-success rounded-pill me-2'>1</span> {this.state.mode===SUBSCRIBE_FORM ? trans('Mameno formulaire') : trans('Manana mpiantoka efa manana kaonty')}</h5>
                                    <h6><span className='badge bg-primary rounded-pill me-2'>2</span> {trans('Famantarana maha-olona')}</h6>
                                    <div className="form-floating mb-3">
                                        <input type="text" required className="form-control" id="fifonanaRegisterFloatingName" placeholder="Rakotomalala Marie" />
                                        <label htmlFor="fifonanaRegisterFloatingName">{trans('Anarana feno')}</label>
                                    </div>
                                    <div className='form-group mt-3'>
                                        <select name='sokajin-taona' className='form-select' required onChange={this.handleAgeChange}>
                                            <option value="">{trans('Sokajin-taonanao')}</option>
                                            {AGES.map(age=><option key={age.from} value={age.from}>{age.label}</option>)}
                                        </select>
                                    </div>
                                    <hr className='my-3'/>
                                    <h6><span className='badge bg-primary rounded-pill me-2'>3</span> {trans('Mivavaka/misoratra aiza?')}</h6>
                                    <div className="form-floating mb-3">
                                        <input type="text" required className="form-control" id="fifonanaRegisterFloatingParoasy" placeholder="Antanimena, Diosezin'Antananarivo" />
                                        <label htmlFor="fifonanaRegisterFloatingParoasy">{trans('Paroasy, distrika, diosezy, Lasapely...')}</label>
                                    </div>
                                    <div className='form-group mt-3'>
                                        <label className='control-label'>{trans('Nahavita Konfesy Voalohany')}</label>
                                        <select name='sakramenta[konfesy]' className='form-select' onChange={this.handleKonfesy} defaultValue={this.models('state.data.sakramenta.konfesy.status')}>
                                            <option value="1">{trans('Eny')}</option>
                                            <option value="0">{trans('Tsia')}</option>
                                            <option value="3">{trans('Hianatra')}</option>
                                            <option value="2">{trans('Mpianatra')}</option>
                                        </select>
                                    </div>
                                    <div className={this.models('state.data.sakramenta.konfesy.status')==0 || this.models('state.data.sakramenta.konfesy.status')==3 ? '':'d-none'}>
                                        <div className='alert alert-info'>Mila mianatra herin-taona ianao vao afaka mikonfesy. Manatòna ny filohan'ny APV misy anao na ny pretra.</div>
                                        <button className='btn btn-secondary' type="button">Télécharger le formulaire d'inscription au sacrement</button>
                                    </div>
                                    <div className={this.models('state.data.sakramenta.konfesy.status')==1 || this.models('state.data.sakramenta.konfesy.status')==2 ? '':'d-none'}>
                                        <div className="form-group mt-3">
                                            <label className="control-label">{trans("Daty")}</label>
                                            <input type="date" className="form-control" required name="sakramenta[konfesy][date]" />
                                        </div>
                                        <div className="form-floating mt-3">
                                            <input type="text" className="form-control" id="konfesyClassroomFloating" placeholder="Toerana nianarana" name="sakramenta[konfesy][classroom]"/>
                                            <label htmlFor="konfesyClassroomFloating">{this.models('state.data.sakramenta.konfesy.status')==1?trans('Toerana nianarana'):trans('Aiza no mianatra?')}</label>
                                        </div>
                                        <div className="form-floating mt-3">
                                            <input type="text" className="form-control" id="konfesyParentFloating" placeholder="Mpiantoka" name="sakramenta[konfesy][parent]"/>
                                            <label htmlFor="konfesyParentFloating">{trans("Anarana fenon'ny mpiantoka")}</label>
                                        </div>
                                        <button type="button" className="btn btn-primary mt-3">{trans('Anokafy kaonty')}</button>
                                    </div>
                                </div>
                                <div className={(this.state.step===1 && this.state.mode===SUBSCRIBE_WIZARD)?'':'d-none'}>
                                    <h5 className='mouse-pointable alpha-30' onClick={()=>this.setState({step:0})}><span className='badge bg-success rounded-pill me-2'>1</span> {trans('Antsoinay sy raisinay an-tsoratra')}</h5>
                                    <h6><span className='badge bg-primary rounded-pill me-2'>2</span> {trans('Famantarana maha-olona')}</h6>
                                    <div className="form-floating mb-3">
                                        <input type="text" required className="form-control" id="fifonanaWizardFloatingName" placeholder="Rakotomalala Marie" />
                                        <label htmlFor="fifonanaWizardFloatingName">{trans('Anarana feno')}</label>
                                    </div>
                                    <div className='form-group mt-3'>
                                        <select name='sokajin-taona' className='form-select' required onChange={this.handleAgeChange}>
                                            <option value="">{trans('Sokajin-taonanao')}</option>
                                            {AGES.map(age=><option key={age.from} value={age.from}>{age.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input type="text" required name="user[phone]" className="form-control" id="fifonanaPhoneFloating" placeholder="0341111111" />
                                        <label htmlFor="fifonanaPhoneFloating">{trans('Laharana telefonina iantsoana anao')}</label>
                                    </div>
                                    <div className="form-group mt-3">
                                        <label className="control-label">{trans("Fotoana mampety hamerenanay miantso anao")}</label>
                                        <input type="datetime-local" className="form-control" required name="user[meeting]" />
                                    </div>
                                    <button type="button" className="btn btn-primary mt-3">{trans('Andrasako ny fiantsoana ahy')}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

Modelizer(Anonymous)

class Card extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        return <div className='row'>
            {this.models('state.me.sakramenta.fampihavanana') ? <React.Fragment><div className='mb-3'>
                <div className='card shadow'>
                    <div className='card-header'>
                        {trans('Ireo Célebration Penitentielle Anio')}
                    </div>
                    <div className='card-body'>

                    </div>
                </div>
            </div>
                <div className='mb-3'>
                    <div className='card shadow'>
                        <div className='card-header'>
                            {trans('Mompera afaka mampikonfesy izay akaiky anao')}
                        </div>
                        <div className='card-body'>

                        </div>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className='card shadow'>
                        <div className='card-header'>
                            {trans('Haka rendez-vous am pretra afaka mampikonfesy')}
                        </div>
                        <div className='card-body'>

                        </div>
                    </div>
                </div></React.Fragment> : this.models('state.me.sakramenta.batemy') ? <div className='mb-3'>
                    <div className='card shadow'>
                        <div className='card-header'>
                            {trans('Hisoratra anarana hianatra sakramenta fampihavanana')}
                        </div>
                        <div className='card-body'>

                        </div>
                    </div>
                </div> : <Anonymous />}
        </div>
    }
}

export default Modelizer(Card);