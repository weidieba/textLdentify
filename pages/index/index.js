// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
  },
  onLoad() {
  },
  testImage() {
      wx.navigateTo({
          url: `/pages/cropper/cropper`
      })        
  },
  testCloudF() {
    wx.cloud.init()
    wx.cloud.callFunction({
      // 云函数名称
      name: 'create',
      // 传给云函数的参数
      success: function(res) {
        console.log(res) // 3
      },
      fail: console.error
    })
  }
})
