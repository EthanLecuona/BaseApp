/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: "standalone",
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
    },
    webpack: (cfg, options = {}) => {
        cfg.externals.push('sharp')
        const { webpack } = options
        const regex = /^sharp$/
        cfg.plugins.push(new webpack.IgnorePlugin({
          resourceRegExp: regex,
        }))
        return cfg;
    }
};
export default nextConfig;


