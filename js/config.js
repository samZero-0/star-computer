// API Configuration - Update this URL after deploying backend to Vercel
// For local development: 'http://localhost:5000/api'
// For production: 'https://starcomputerbackend.vercel.app/api'

const CONFIG = {
    // Change this to your Vercel backend URL after deployment
    API_BASE_URL: 'http://localhost:5000/api',
    
    // Set to true to use localStorage only (no backend)
    OFFLINE_MODE: false
};

// Export for use in other files
if (typeof window !== 'undefined') {
    window.APP_CONFIG = CONFIG;
}
