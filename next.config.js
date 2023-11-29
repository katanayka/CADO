/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5000/api/:path*',
      },
    ]
  },
  images: {
    domains: ['placehold.co']
  }
}

module.exports = nextConfig
