const SERVER_HOST = process.env.NODE_ENV === 'development' ? 'localhost:6000' : 'ctf.b01lers.com'

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_BASE: `https://${SERVER_HOST}`,
        WS_BASE: `wss://${SERVER_HOST}/ws`,
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
}

module.exports = nextConfig
