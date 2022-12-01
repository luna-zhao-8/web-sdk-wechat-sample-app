Page({
  handleStartActivity() {
    wx.navigateTo({
      url: '/pages/activity/TestYourAnglesMain/index'
    })
  },
  handleCancelActivity() {
    wx.navigateBack()
  }
})