module.exports = {
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'es', 'fr', 'ar', 'zh', 'pt', 'ru', 'de', 'ja', 'hi'],
      localeDetection: true,
    },
    reloadOnPrerender: process.env.NODE_ENV === 'development',
  }