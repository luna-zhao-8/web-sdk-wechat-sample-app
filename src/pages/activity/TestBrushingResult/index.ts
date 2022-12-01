import { getGlobalData } from '../../../utils/global';

Page({
  data: {
    checkup: null
  },
  onLoad(query: Record<string, string | undefined>): void | Promise<void> {
    this.setData({
      checkup: getGlobalData('testBrushingCheckUp')
    })
  },
  navToHome() {
    wx.navigateBack({
      delta: 3,
    })
  }
})