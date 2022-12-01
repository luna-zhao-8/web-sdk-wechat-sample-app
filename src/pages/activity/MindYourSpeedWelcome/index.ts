Page({
  handleStartActivity() {
    wx.navigateTo({
      url: '/pages/activity/MindYourSpeedMain/index'
    })
  },
  handleCancelActivity() {
    wx.navigateBack()
  }
})