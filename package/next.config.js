/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value: "autoplay=*, fullscreen=*, picture-in-picture=*",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
