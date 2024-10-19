const { randomUUID } = require('crypto');

const withPWA = require('next-pwa')({
    dest: 'public',
});
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    generateBuildId: async () => {
        // You can, for example, get the latest git commit hash here
        return randomUUID();
    },
};

module.exports = withPWA(nextConfig);
