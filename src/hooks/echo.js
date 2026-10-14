import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// const echo = new Echo({
//     broadcaster: 'reverb',
//     key: 'kodtrf3zo2lot3rbkgq9',
//     wsHost: 'localhost',
//     wsPort: 8080,
//     forceTLS: false,  // Set to false for local development
//     enabledTransports: ['ws', 'wss'],
// });

const echo = new Echo({
    broadcaster: "reverb",
    key: "kodtrf3zo2lot3rbkgq9",
    wsHost: "nbpo8080.teaconcepts.net",
    wsPort: 8080,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ["ws"],
    scheme: "http",
});

export default echo;