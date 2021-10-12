// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
  },
  onShow() {
    this.createCollection();
  },
  testImage() {
      wx.navigateTo({
            url: `/pages/cropper/cropper`
      })      
  },
    createCollection() {
        let data =  wx.getStorageSync('openid');
        if (!data.openid) {
            app.getCloudUserInfo().then(res => {
                app.callCloud('createCollection', {openid: res.OPENID}, res => {
                    console.log(res)
                })
            });
        } else {
            app.callCloud('createCollection', {openid: data.openid}, res => {
                console.log(res)
            })
        }
    },
})
