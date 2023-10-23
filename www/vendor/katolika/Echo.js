'use client'

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

/*
//local remote
const laravelEcho = new Echo({
    broadcaster: 'pusher',
    key: '1ec7db3d-24ad-62a0-b0d1-0242ac110002',
   // wsHost: 'socket.letananarivien.com',
    wsHost: 'katolika.local.control-code.com',
    //wsPort: 80,
    wsPort: 6001,
    //wssPort: 443,
    forceTLS: false,
    encrypted: true,
    disableStats: true,
    //enabledTransports: ['ws', 'wss'],
    enabledTransports: ['ws'],
    cluster: 'mt1'
});
*/
/*
//local
const laravelEcho = new Echo({
    broadcaster: 'pusher',
    key: '1ec7db3d-24ad-62a0-b0d1-0242ac110002',
   // wsHost: 'socket.letananarivien.com',
    wsHost: 'www.katolika.wr',
    //wsPort: 80,
    wsPort: 6001,
    //wssPort: 443,
    forceTLS: false,
    encrypted: true,
    disableStats: true,
    //enabledTransports: ['ws', 'wss'],
    enabledTransports: ['ws'],
    cluster: 'mt1'
});
*/
//prod
const laravelEcho = new Echo({
    broadcaster: 'pusher',
    key: '1ec7db3d-24ad-62a0-b0d1-0242ac110002',
    wsHost: 'socket.letananarivien.com',
    wsPort: 80,
    wssPort: 443,
    forceTLS: false,
    encrypted: true,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    enabledTransports: ['ws'],
    cluster: 'mt1'
});

export default laravelEcho
