const mode = process.env.BUILD_MODE;

const config = {
  mode,
  copy: [
    'src/app.json',
    'src/app.wxss',
  ],
  bundles: {
    global: {
      sideEffects: ['@kolibree/ble-wechat-mini'],
      commonChunks: [
        '@kolibree/api-client',
        '@kolibree/ble-wechat-mini',
        '@kolibree/ble-core',
        '@kolibree/toothbrush-client',
        '@kolibree/local-storage',
        '@kolibree/three-on-wechat',
        '@kolibree/jaw-wechat',
        '@kolibree/three-on-wechat',
        'rxjs',
        'bytebuffer',
        // '@kolibree/ui-components-wechat-mini',
        {
          input: [
            '@kolibree/ui-components-wechat-mini/vendor.js',
            '@kolibree/ui-components-wechat-mini/library.js'
          ],
          output: 'ui-components-lib.js'
        }
      ]
    },
    subPackage: {
      'pages/activity': {
        commonChunks: [
          '@kolibree/kml',
          '@kolibree/websocket-client',
          '@kolibree/brushing-activity-utils',
          '@kolibree/i18n',
          'lottie-miniprogram',
          {
            input: [
              '@kolibree/guided-brushing-wechat-mini/vendor.js',
              '@kolibree/guided-brushing-wechat-mini/library.js'
            ],
            output: 'guided-brushing-lib.js'
          },
          {
            input: [
              '@kolibree/test-your-angles-wechat-mini/vendor.js',
              '@kolibree/test-your-angles-wechat-mini/library.js'
            ],
            output: 'test-your-angles-lib.js'
          },
          {
            input: [
              '@kolibree/mind-your-speed-wechat-mini/vendor.js',
              '@kolibree/mind-your-speed-wechat-mini/library.js',
            ],
            output: 'mind-your-speed-lib.js'
          },
          {
            input: [
              '@kolibree/test-brushing-wechat-mini/vendor.js',
              '@kolibree/test-brushing-wechat-mini/library.js',
            ],
            output: 'test-brushing-lib.js'
          }
        ]
      }
    }
  },
};

module.exports = config;
