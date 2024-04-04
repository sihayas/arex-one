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
      "voir.space",
      "https://assets.app.space",
    ],
    loader: "custom",
    loaderFile: "./imageLoader.js",
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.experiments = config.experiments || {};
    config.experiments.asyncWebAssembly = true;
    return config;
  },
};

module.exports = nextConfig;
