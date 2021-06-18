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
})
