import { getGlobalData } from '../../../utils/global';

Page({
  data: {
    checkup: null
  },
  onLoad(query: Record<string, string | undefined>): void | Promise<void> {
    this.setData({
      checkup: getGlobalData('guidedBrushingCheckup')
    })
  },
  navToHome() {
    wx.navigateBack({
      delta: 3,
    })
  }
})