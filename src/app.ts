import '@kolibree/ble-wechat-mini';
import { CommonRequest, setCpChinaApiServerCredentials } from '@kolibree/api-client';
import { requestConfig, cpChinaApiServerConfig } from './utils/config';

App({
  onLaunch(/*options*/) {
    
  },
  onShow(/*options*/) {
    CommonRequest.setRequestConfig(requestConfig);
    setCpChinaApiServerCredentials(cpChinaApiServerConfig)
  },
  onHide() {
    // Do something when hide.
  },
  onPageNotFound() {
    // TODO
  },
  onUnhandledRejection(err) {
    // TODO
  },
  onThemeChange() {
    // TODO
  },
  onError(msg) {
  },
});
