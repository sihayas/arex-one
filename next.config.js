/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "i.pinimg.com",
      "is1-ssl.mzstatic.com",
      "is2-ssl.mzstatic.com",
      "is3-ssl.mzstatic.com",
      "is4-ssl.mzstatic.com",
      "is5-ssl.mzstatic.com",
      "lh3.googleusercontent.com",
      "64.media.tumblr.com",
      "media.tenor.com",
      "wallpapers-clan.com",
    ],
  },
};

module.exports = nextConfig;
