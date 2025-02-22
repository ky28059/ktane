/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_BASE: `http://localhost:8000`,
        WS_BASE: `ws://localhost:8000/ws`,
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    reactStrictMode: false
}

module.exports = nextConfig
