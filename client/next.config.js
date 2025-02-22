const SERVER_HOST = process.env.NODE_ENV === 'development' ? 'localhost:8000' : 'ctf.b01lers.com'

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_BASE: `http://${SERVER_HOST}`,
        WS_BASE: `ws://${SERVER_HOST}/ws`,
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    reactStrictMode: false
}

module.exports = nextConfig
