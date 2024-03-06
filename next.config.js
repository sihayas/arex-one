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
    // Note: we provide webpack above so you do not need to import it
    // Enable WebAssembly experiments
    config.experiments = {
      ...config.experiments, // Spread any existing experiments
      asyncWebAssembly: true,
    };

    // Optionally add more custom webpack configuration here
    // For example, to add a rule for .wasm files, you could do:
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    // Important: return the modified config
    return config;
  },
};

module.exports = nextConfig;
