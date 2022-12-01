# web-sdk-wechat-sample-app
Welcome to the Kolibree Web SDK Wechat sample app.
This sample app is used to show the usage of Kolibree Web SDK

## What can you expect

- Account system
  - Configure Web services credential
  - Sign in / out
  - Profile CRUD
- Device
  - Discovery and connectivity
  - Device manipulation
    - toggle vibrator
    - read mac address
    - read serial number
    - set / get brushing mode
    - get battery level
  - OTA update
- Brushing activity
  - Guided brushing
  - Test your angles
  - Mind your speed
  - Test brushing
- Wechat mini app bundling tool

## Web SDKs

### Rationale
The design of Kolibree Web SDK is developed for web apps ranging from good old standard web applications to custom web
apps running on non-standard platforms like Miniprogram. As library authors, we believe in bottom-up design thinking and
leaving the decision of choosing a right framework for app developers who are expert in domain knowledge.



### Utils
The core abstractions and APIs for working with Bluetooth Low Energy and Kolibree web service
- @kolibree/ble-core
- @kolibree/ble-wechat-mini
- @kolibree/toothbrush-client
- @kolibree/api-client
- @kolibree/websocket-client
- @kolibree/kml

### Brushing activities
All brushing activities are full featured with UI and business logic
- @kolibree/guided-brushing-wechat-mini
- @kolibree/mind-your-speed-wechat-mini
- @kolibree/test-brushing-wechat-mini
- @kolibree/test-your-angles-wechat-mini
- @kolibree/ui-components-wechat-mini

### Dev tool
To tackle the bundle size limitation and npm-unfriendly issues with wechat, we introduced `@kolibree/minipack` which is a bundling
tool designed for Wechat mini program. You can use package system flexibly and can easily adjust the library you use to avoid reaching
the size limitation based on configuration. More details please see `minipack.config.js`
- @kolibree/minipack


## Prerequisites
- System Requirement
  - Node.js v14.18.0
  - Mac OS
- Log in [Kolibree npm registry](https://kolibree.jfrog.io/artifactory/api/npm/web-sdk-local) 
- Kolibree Web service credential

