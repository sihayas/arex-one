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
      "voirmedia.blob.core.windows.net",
      "voir.space",
    ],
    unoptimized: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Enable WebAssembly experiments
    config.experiments = config.experiments || {}; // Ensure the experiments object exists
    config.experiments.asyncWebAssembly = true;

    // Important: return the modified config
    return config;
  },
};

module.exports = nextConfig;
