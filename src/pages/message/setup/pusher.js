import Pusher from 'pusher-js';

const pusher = new Pusher('21caf4706d2ac5592ef4', {
    cluster: "ap1",
    // Add other options as needed (e.g., encrypted: true)
    // If you are using auth endpoints, you can add auth configuration
    authEndpoint: '/broadcasting/auth', // Your auth endpoint
    auth: {
        headers: {
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? null
        }
    }
});

export default pusher;