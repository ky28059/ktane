/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_BASE: `http://ctf.b01lers.com:8000`,
        WS_BASE: `ws://ctf.b01lers.com:8000/ws`,
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    reactStrictMode: false
}

module.exports = nextConfig
