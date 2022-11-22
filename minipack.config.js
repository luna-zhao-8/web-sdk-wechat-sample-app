const mode = process.env.BUILD_MODE;

const config = {
  mode,
  copy: [
    'src/app.json',
    'src/app.wxss',
  ],
  bundles: {
    global: {
      commonChunks: [
        '@kolibree/api-client',
        '@kolibree/ble-wechat-mini',
        '@kolibree/ble-core',
        '@kolibree/toothbrush-client',
        '@kolibree/kml',
        '@kolibree/websocket-client',
        '@kolibree/local-storage',
        '@kolibree/brushing-activity-utils',
        '@kolibree/three-on-wechat',
        '@kolibree/jaw-wechat',
        'rxjs',
        'bytebuffer'
      ]
    },
  },
};

module.exports = config;
