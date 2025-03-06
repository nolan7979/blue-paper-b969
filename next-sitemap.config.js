/**
 * @type {import('next-sitemap').IConfig}
 * @see https://github.com/iamvishnusankar/next-sitemap#readme
 */
module.exports = {
  // !STARTERCONF Change the siteUrl
  /** Without additional '/' on the end, e.g. https://theodorusclarence.com */
  siteUrl: 'https://uniscore.vn/sitemap.xml/sitemap.xml',
  generateRobotsTxt: true,
  sourceDir: '.build',
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: [
          '/standings/',
          '/draw/',
          '/redirect/',
          '/newsfeed/',
          '/match/',
        ],
      },
    ],
  },
};
