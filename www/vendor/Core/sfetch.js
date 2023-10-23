'use client'

import store from '@/Core/Store'

export default function secureFetch(url, options) {
    return new Promise((resolve, reject) => {
        fetch(url, options).then(response => {
            // response only can be ok in range of 2XX
            if (response.ok) {
                // you can call response.json() here too if you want to return json
                response.json(json=>resolve(json))
            } else {
                //handle errors in the way you want to
                switch (response.status) {
                    case 404:
                        console.log('Object not found');
                        break;
                    case 500:
                        console.log('Internal server error')
                        response.json().then(json=>{
                            store.dispatch({
                                type: 'error',
                                content: json.content,
                                mode: json.mode
                            })
                            reject({
                                error: true
                            });
                        })
                        break;
                    default:
                        console.log('Some error occured');
                        break;
                }

                //here you also can thorow custom error too
            }
        })
            .catch(error => {
                //it will be invoked mostly for network errors
                //do what ever you want to do with error here
                console.log(error);
                reject({
                    error: true
                });
            });
    });
}