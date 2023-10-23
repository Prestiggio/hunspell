import store from '@/Core/Store';
class Auth
{
    constructor() {
        this.fetchRunning = false
        this.resolves = []
        this.data = false
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type==='login') {
                this.resolves.map(reso=>reso.call(null, storeState.data))
            }
        })
        this.setData = this.setData.bind(this)
    }

    setToken(token) {
        const sk = document.querySelector('body').getAttribute('data-sk')
        localStorage.setItem(sk, token)
    }

    logout() {
        localStorage.clear()
    }

    setData(data) {
        this.data = data
    }

    login() {
        return new Promise((resolve, reject)=>{
            this.resolves.push(resolve)
            if(this.data) {
                this.resolves.map(reso=>reso.call(null, this.data))
                return
            }
            const sk = document.querySelector('body').getAttribute('data-sk')
            if(localStorage.getItem(sk)) {
                if(!this.fetchRunning) {
                    this.fetchRunning = true
                    fetch(`/api/sk`, {
                        method: 'POST',
                        body: JSON.stringify({
                            sk
                        }),
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem(sk),
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }).then(resp=>{
                        if(resp.status===401) {
                            throw 'expired token'
                        }
                        return resp.json()
                    }).then(json=>{
                        this.resolves.map(reso=>reso.call(null, json))
                        this.fetchRunning = false
                    }).catch(e=>{
                        fetch(`/api/saint-login`, {
                            method: 'POST'
                        }).then(response=>response.json()).then(json=>{
                            localStorage.setItem(sk, json.access_token)
                            fetch(`/api/sk`, {
                                method: 'POST',
                                headers: {
                                    'Authorization': 'Bearer ' + localStorage.getItem(sk),
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                }
                            }).then(resp=>resp.json()).then(json=>{
                                this.resolves.map(reso=>reso.call(null, json))
                                this.fetchRunning = false
                            })
                        })
                    })
                }
            }
            else {
                if(!this.fetchRunning) {
                    this.fetchRunning = true
                    fetch(`/api/saint-login`, {
                        method: 'POST'
                    }).then(response=>response.json()).then(json=>{
                        localStorage.setItem(sk, json.access_token)
                        fetch(`/api/sk`, {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer ' + localStorage.getItem(sk),
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(resp=>resp.json()).then(json=>{
                            this.resolves.map(reso=>reso.call(null, json))
                            this.fetchRunning = false
                        })
                    })
                }
            }
        })
    }
}

const auth = new Auth()

export default auth