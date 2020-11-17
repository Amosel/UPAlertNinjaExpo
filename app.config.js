export default {
  expo: {
    name: 'UPAlertNinjaExpo',
    slug: 'AlertNinja',
    owner: 'davelin10017',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './app/assets/icon.png',
    splash: {
      image: './app/assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      infoPlist: {
        UIBackgroundModes: ['audio'],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './app/assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
      useNextNotificationsApi: true,
    },
    web: {
      favicon: './app/assets/favicon.png',
    },
  },
};
