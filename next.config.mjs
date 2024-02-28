const prod = process.env.NODE_ENV === 'production'
const withPWA = (await import('next-pwa')).default({
    dest: 'public',
    disable: prod ? false: true
  });


/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true,
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
// export default nextConfig;

export default withPWA(nextConfig)

