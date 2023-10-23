'use client'

import React, {Component} from 'react';
import swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import trans, {LOADINGEND, LOADINGSTART, TCOUNTER} from '@/Core/translations';
import qs from 'qs';
import Dropzone from '@/Core/dropzone';
import store from '@/Core/Store';
import auth from '@/katolika/Auth';
import 'jquery-form/src/jquery.form';
import Parsley from 'parsleyjs';
import $ from "jquery";

Parsley.addMessages('mg', {
    defaultMessage: trans("Cette valeur semble non valide."),
    type: {
      email:        "Cette valeur n'est pas une adresse email valide.",
      url:          "Cette valeur n'est pas une URL valide.",
      number:       "Cette valeur doit être un nombre.",
      integer:      "Cette valeur doit être un entier.",
      digits:       "Cette valeur doit être numérique.",
      alphanum:     "Cette valeur doit être alphanumérique."
    },
    notblank:       "Cette valeur ne peut pas être vide.",
    required:       trans("Fenoy ny banga."),
    pattern:        "Cette valeur semble non valide.",
    min:            "Cette valeur ne doit pas être inférieure à %s.",
    max:            "Cette valeur ne doit pas excéder %s.",
    range:          "Cette valeur doit être comprise entre %s et %s.",
    minlength:      "Cette chaîne est trop courte. Elle doit avoir au minimum %s caractères.",
    maxlength:      "Cette chaîne est trop longue. Elle doit avoir au maximum %s caractères.",
    length:         "Cette valeur doit contenir entre %s et %s caractères.",
    mincheck:       "Vous devez sélectionner au moins %s choix.",
    maxcheck:       "Vous devez sélectionner %s choix maximum.",
    check:          "Vous devez sélectionner entre %s et %s choix.",
    equalto:        "Cette valeur devrait être identique."
  });
  
  Parsley.setLocale('mg');

const components = {}

const layout_templates = {}

const fetchSuccess = new Event('success');

export const register = (name, callback)=>{
    components[name] = callback
}

export const registerLayoutTemplate = (name, params)=>{
    params.id = name
    layout_templates[name] = params
}

export const getTemplates = ()=>{
    return Object.values(layout_templates)
}

$( document ).ajaxComplete(function( event, xhr, settings ){
    if(xhr.responseJSON && ('_debugbar' in xhr.responseJSON)) {
        console.log(xhr.responseJSON._debugbar.queries)
    }
});

$(document).ajaxSend(function(event, jqXHR, ajax){
	if(ajax.isPagination) {
		let url = ajax.url
		let queryparts = url.split(/\?/)
		if(queryparts.length>1) {
			let queries = qs.parse(queryparts[1])
			delete queries.json
			delete queries.ry
			url = queryparts[0]+'?'+qs.stringify(queries)
		}
		window.history.pushState({},"", url)
    }
    if(ajax.isProgressing) {
        $( "body" ).removeClass("ry-loading");
    }
});

$(document).ajaxStart(function() {
    if(TCOUNTER.AJAX<0)
        TCOUNTER.AJAX = 0
    TCOUNTER.AJAX++;
    $("body").addClass("ry-loading");
});

$(document).ajaxError(function(event, response, ajax) {
    TCOUNTER.AJAX--;
    if(TCOUNTER.AJAX<=0)
        $( "body" ).removeClass("ry-loading");
    let errorText = (response.responseJSON && response.responseJSON.message) ? response.responseJSON.message : trans("Une erreur s'est produite");
    switch(response.status) {
    	case 403:
    		errorText = trans("Cette action n'est pas autorisée, veuillez contacter l'administrateur pour vous accorder ce droit");
			break;
		case 419:
		case 401:
			window.location.reload();
			errorText = trans("Cette session a expiré");
			break;
	}
	if(response.status!=303 && response.status!=404 && !ajax.isProgressing) {
		swal.fire({
			title: (response.responseJSON && response.responseJSON.message) ? trans(`Désolé`) : trans('Désolé'),
			text: errorText,
			type: 'error'
		});
    }
    else if(response.status && ajax.isProgressing) {
        
    }
});

$(window).bind("beforeunload",function(event) {
	if($(".confirmquit").length>0 || $(".ry-loading").length>0) {
		return "Veuillez cliquer sur enregistrer avant de quitter cette page";
	}
});

$(document).ajaxStop(function() {
    TCOUNTER.AJAX--;
    if(TCOUNTER.AJAX<=0)
        $( "body" ).removeClass("ry-loading");
});

$.fn.centraleValidate = function() {
    this.each(function(){
        let requiredInput = $(this).next().find('select[required], input[required], textarea[required]')
        let requiredInput2 = $(this).siblings('select[required], input[required], textarea[required]')
        const $icon = $('<i class="alpha-80 fa fa-lock pl-2 text-orange"></i>')
        if(requiredInput.length>0) {
            if(!$(this).hasClass("required"))
                $(this).addClass('required').append($icon)
        }
        else if(requiredInput2.length>0) {
            if(!$(this).hasClass("required"))
                $(this).addClass('required').append($icon)
        }
        else if($(this).hasClass("required")) {
            $(this).removeClass('required')
            $(this).find('i.fa').remove()
        }
    });
}

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

var dialogData = {};

export const langUrl = function(lang){
    let queries = qs.parse(document.location.search.replace(/^\?/, ''))
    queries.lang = lang
    return document.location.pathname + '?' + qs.stringify(queries)
};

export class Img extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            src : this.props.src?this.props.src:this.props.broken
        }
    }

    componentDidMount() {
        const broken = this.props.broken ? this.props.broken : blank
        $(this.refs.img).on('error', function(){
            if(!this.broken) {
                this.src = broken;
                this.broken = true;
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.src!=this.props.src)
            this.setState({
                src : this.props.src
            })
    }

    render() {
        return <img ref="img" src={this.state.src} className={this.props.className}/>
    }
}

export const refetch = url=>{
    return new Promise((resolve, reject)=>{
        const retrying = ()=>{
            fetch(url).then(response => {
                response.json().then(data => {
                    if(data.retry) {
                        setTimeout(retrying, parseInt(data.retry.timeout)*1000)
                    }
                    else {
                        resolve(data)
                    }
                })
            }).catch(e=>reject(e))
        }
        retrying()
    })
}

class Ry extends Component {
    constructor(props) {
        super(props);
        this.getRaw = this.getRaw.bind(this);
        this.state = {
            data: this.props.content
        }
        if(this.props.content && this.props.content.user && this.props.content.user.id) {
            auth.setData(this.props.content.user)
        }
    }

    getRaw() {
        return this.state
    }

    componentDidMount() {
        $('input[type=number]').on('mousewheel', function(e) {
            $(e.target).blur();
        });
        store.subscribe(() => {
            const state = store.getState();
            if (state.type === this.props.id) {
                this.setState({
                    data: state.content
                })
            }
        });
        const props = this.props.content;
        $('a[href^="#dialog/"]').each(function () {
            let dis = $(this);
            const f = function (e) {
                e.preventDefault();
                if (dis.data("content") && dis.data("content") != '')
                    store.dispatch({
                        type: 'dialog',
                        url: dis.attr('href').replace('#dialog', ''),
                        method: 'post',
                        data: props[dis.data("content")],
                        display: dis.data("display")
                    });
                else
                    store.dispatch({type: 'dialog', url: dis.attr('href').replace('#dialog', ''), method: 'get', display: dis.data("display")});
                return false;
            };
            if (!this.dialogBound) {
                $(this).bind('click', f);
                this.dialogBound = true;
            }
        });
        $('a[href^="#inline/"]').each(function () {
            let dis = $(this);
            const f = function (e) {
                e.preventDefault();
                if (dis.data("content") && dis.data("content") != '')
                    store.dispatch({
                        type: 'inline',
                        url: dis.attr('href').replace('#inline', ''),
                        method: 'post',
                        data: props[dis.data("content")]
                    });
                else
                    store.dispatch({type: 'inline', url: dis.attr('href').replace('#inline', ''), method: 'get'});
                return false;
            };
            if (!this.inlineBound) {
                $(this).bind('click', f);
                this.inlineBound = true;
            }
        });
        $('input:hidden[name="ry"]').each(function(){
            const $_form = $(this).parents('form')
            $_form.ajaxForm({
                beforeSubmit: function(arr, $form) {
                    return $form.parsley().validate()
                },
                beforeSerialize: function ($form, options) {
                    if($form.attr('method')=='get')
                        options.isPagination = true;
                    const thery = $form.find("input:hidden[name='ry']")[0].ry;
                    if(thery && 'getRaw' in $form.find("input:hidden[name='ry']")[0].ry) {
                        const raw = $form.find("input:hidden[name='ry']")[0].ry.getRaw();
                        options.data = Array.isArray(raw) ? {'ry.array': raw} : raw
                    }
                },
                success: function (response) {
                    if (response.type) {
                        store.dispatch(response);
                    }
                    if(response.access_token) {
                        store.dispatch({
                            type: 'login',
                            data: response
                        })
                        auth.setToken(response.access_token)
                    }  
                },
                error: e=>{
                    
                }
            });
        })
        $('label').centraleValidate()
        $('form').parsley({
            excluded : ':hidden'
        });
        $("[data-dropzone-action]").each(function(){
            if(this.dropzone)
				return;
            const dz = new Dropzone(this, {
                url : $(this).data('dropzone-action'),
                paramName : $(this).data('name'),
                acceptedFiles: $(this).data('accepted-files') ? $(this).data('accepted-files') : ($(this).data('any-file')?null:'.png,.jpg,.jpeg,.gif'),
                params: {
                    id: $(this).data('mediable-id')
                },
                dictCancelUpload: trans('Annuler'),
                dictCancelUploadConfirmation: trans("Êtes-vous certain d'annuler le transfert?"),
                dictInvalidFileType: trans(`Ce type de fichier n'est pas pris en charge`),
                previewTemplate: `<div style="display: none;"></div>`,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            })
            const LOGOadded = (file) => {
                if(/^image/.test(file.type)) {
                    const imgContainer = $($(this).data("preview-target"));
                    var reader = new FileReader();
        
                    reader.onload = function (e) {
                        imgContainer.attr('src', e.target.result);
                    };
        
                    reader.readAsDataURL(file);
                }
            };
            dz.on('addedfile', LOGOadded);
            dz.on("sending", ()=>LOADINGSTART($(this).data('name')));
            dz.on("complete", ()=>LOADINGEND($(this).data('name')));
            dz.on("success", (event, response)=>{
                if(response.type) {
                    store.dispatch(response)
                }
            })
        });
    }

    render() {
        let ar = []
        if(this.props.class) {
            if(this.props.class in components) {
                return components[this.props.class].call(null, this.props.content, this.props.children)
            }
            ar = this.props.class.split('.')
        }
        if(ar.length>0 && (ar[0] in components)) {
            let base = components[ar[0]]
            if(base && ar.length>1) {
                for(var i=1; i<ar.length; i++) {
                    if(base)
                        base = base[ar[i]]
                    else
                        break
                }
            }
            if(base) {
                const Cpnt = base
                return <Cpnt data={this.props.content}>
                    {this.props.children}
                </Cpnt>
            }
        }
        return null;
    }
}

Ry.global = {};

Ry.globalCalls = {};

Ry.setGlobal = (elementname, content)=>{
    if(!Ry.global[elementname])
        Ry.global[elementname] = [];
    Ry.global[elementname].push(content);
    if(elementname in Ry.globalCalls) {
        Ry.globalCalls[elementname](content)
        delete Ry.globalCalls[elementname]
    } 
}

Ry.getGlobal = (search, defaultValue, foundCallback) => {
    let obj = Ry.global
    let found = false
    const browse = (o) => {
        Object.keys(o).reduce((previous, key) => {
            if (typeof(o[key]) === 'object') {
                if (key === search) {
                    foundCallback(o[key])
                    found = true;
                    return;
                }
                else {
                    if ('length' in o[key]) {
                        o[key].map(j => browse(j))
                    }
                    else
                        browse(o[key])
                }
            }
        })
    };
    browse(obj);
    if (!found) {
        Ry.globalCalls[search] = foundCallback
        foundCallback(defaultValue)
    }
};

export default Ry;