import { getToothbrushWrapper } from '@kolibree/toothbrush-client';
import { socketConfig } from '../../../utils/config';


Page({
  data: {
    tbModel: null,
    tbId: null,
    socketInfo: null,
  },
  onShow() {
    const { tbId, tbModel } = getApp().global;
    const tb = getToothbrushWrapper(tbId);
    this.setData({
      tbId,
      tbModel,
      socketConfig,
    })
  },
  handleActivityEnd() {
    wx.navigateTo({
      url: '/pages/activity/TestYourAnglesSummary/index'
    })
  },
  handleTbConnectLost() {
    wx.navigateBack();
  }
})