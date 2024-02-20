/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/u/**',
            },
            {
                protocol: 'https',
                hostname: 'picturesbaseapp.s3.eu-north-1.amazonaws.com',
                port: '',
                pathname: '/**',
            },
        ]
    }
};

export default nextConfig;
