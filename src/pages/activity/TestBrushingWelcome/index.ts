Page({
  handleStartActivity() {
    wx.navigateTo({
      url: '/pages/activity/TestBrushingMain/index'
    })
  },
  handleCancelActivity() {
    wx.navigateBack()
  }
})