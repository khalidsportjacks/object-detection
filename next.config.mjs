/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   reactCompiler: true,
  // },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Override the default webpack configuration
  webpack: (config) => {
    // See https://webpack.js.org/configuration/resolve/#resolvealias
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      "onnxruntime-node$": false,
    };
    return config;
  },
};

export default nextConfig;
