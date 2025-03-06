const MillionLint = require('@million/lint');
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { i18n } = require('./i18n.config.js');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withTwin = require('./withTwin.js');
const crypto = require('crypto');
const path = require('path');

const randomHash = () => crypto.randomBytes(8).toString('hex');
const isProd = process.env.NEXT_PUBLIC_NODE_ENVIRONMENT;

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: (isProd === 'production' || isProd === 'staging') ? process.env.NEXT_PUBLIC_CDN_URL : undefined,
  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING: process.env.FIREBASE_MESSAGING,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
  },
  trailingSlash: false,
  reactStrictMode: true,
  experimental: {
    // disableOptimizedLoading: true,
    // serverSourceMaps: true,
    optimizeFonts: false,
    // workerThreads: true,
    pageEnv: true,
    optimizeServerBuilds: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  productionBrowserSourceMaps: false,
  // Uncoment to add domain whitelist
  images: {
    domains: [
      'img.uniscore.com',
      'res.cloudinary.com',
      'img0.aiscore.com',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      'cdn.qtri247.com',
      'cdn.qtri24h.com',
      'api.sofascore.app',
      'www.sofascore.com',
      'resources.premierleague.com',
      'localhost',
      'api.uni-tech.xyz',
      'img.thesports.com',
      'pub-7b6516c8368d4e87afd6687fce0c5d44.r2.dev',
      'img.uni-tech.xyz',
      'cdn.uniscore.vn',
      // '65.108.153.8',
    ],
  },


  // SVGR
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.alias['@server'] = false;
      config.output.filename = `static/chunks/[name].[contenthash].js`;
      config.output.chunkFilename = `static/chunks/[name].[contenthash].js`;
    }

    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      minChunks: 2,
      maxInitialRequests: 30,
      maxAsyncRequests: 30,
      automaticNameDelimiter: '-',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module, chunks, cacheGroupKey) {
            const match = module.context && module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
            const moduleName = match ? match[1] : 'vendor';
            return `vendor-${moduleName}`;
          },
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
        pages: {
          test: /[\\/]pages[\\/]/,
          name: (module) => {
            const modulePath = module.context.split(/[\\/]pages[\\/]/).pop();
            return `page-${modulePath.split(/[\\/]/)[0]}`;
          },
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
        common: {
          name: 'common',
          minChunks: 2, // Gom các module được sử dụng ít nhất 2 lần vào chunk "common"
          priority: -20,
          reuseExistingChunk: true,
          enforce: true, // Bắt buộc gom các module dùng chung vào chunk "common"
        },
        default: false, // Vô hiệu hóa các chunk mặc định
      },
    };

    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
      cacheDirectory: path.resolve(__dirname, '.build/cache'),
      maxAge: 0, // Set to 0 to clear cache immediately
    };

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });

    if (process.env.NODE_ENV === 'development') {
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      }

      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }

    return config;
  },
  i18n,

};

// Injected content via Sentry wizard below

// const sentryConfig = {
//   org: "score-yq",
//   project: "uniscore-web",
//   silent: isProd === 'production', 
//   reactComponentAnnotation: {
//     enabled: isProd !== 'production',
//   },
//   // tunnelRoute: "/monitoring",
//   hideSourceMaps: true,
//   // automaticVercelMonitors: true,
//   disableLogger: true,
// };

module.exports = MillionLint.next({
  enabled: false
})(withTwin(nextConfig))
