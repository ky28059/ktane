/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_BASE: `https://ktane-backend.b01le.rs`,
        WS_BASE: `wss://ktane-backend.b01le.rs/ws`,
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    reactStrictMode: false
}

module.exports = nextConfig
