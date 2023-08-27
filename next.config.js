const { randomUUID } = require('crypto');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    generateBuildId: async () => {
        // You can, for example, get the latest git commit hash here
        return randomUUID();
    },
};

module.exports = nextConfig;
