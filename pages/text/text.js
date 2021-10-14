//获取应用实例
const app = getApp()
import uuid from '../../utils/uuid';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      text_data: [],
      text: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // app.globalData.textData || []
    let data = app.globalData.textData.length && app.globalData.textData.reduce((pre, net) => {
      net.words && (pre += net.words)
      return pre
    }, '')
    console.log(data)
    this.setData({
      text_data: app.globalData.textData || [],
      text: data
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  hanlerCopy() {
    wx.setClipboardData({
      data: this.data.text,
      success (res) {
        if (res.errMsg === 'setClipboardData:ok') {
          wx.showToast({
            title: '复制成功',
          });
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  addSql() {
    let that = this;
    let id = 'text' + uuid();
    let _openid =  wx.getStorageSync('openid');
    getApp().callCloud("create", {
      _id: id,
      copyText: that.data.text,
      openid: _openid
    }, res=>{
      console.log(res)
  })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})