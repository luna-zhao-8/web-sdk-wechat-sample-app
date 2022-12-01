import { APP_BUILD_VERSION, APP_VERSION, requestConfig, socketConfig } from '../../../utils/config';
import { setGlobalData } from '../../../utils/global';

Page({
  data: {
    userInfo: {
      accessToken: '',
      accountId: null,
      profileId: null,
      handedness: 'left',
    },
    appInfo: {
      appVersion: APP_VERSION,
      buildVersion: APP_BUILD_VERSION,
      clientId: requestConfig.clientId,
      clientSecret: requestConfig.clientSecret,
    },
    socketInfo: socketConfig,
    tbId: '',
    tbModel: '',
  },
  onLoad(query: Record<string, string | undefined>): void | Promise<void> {
    const { accessToken, profileId, accountId, tbId, tbModel } = getApp().global;
    this.setData({
      userInfo : {
        accessToken,
        accountId,
        profileId,
        handedness: 'right'
      },
      tbId,
      tbModel,
    })
  },
  handleCheckup(e) {
    setGlobalData({ testBrushingCheckUp: e.detail });
    wx.navigateTo({
      url: '/pages/activity/TestBrushingResult/index'
    });
  },
  handleTbConnectLost() {
    wx.navigateBack()
  },
  handleTestBrushingQuit() {
    wx.navigateBack()

  }
})