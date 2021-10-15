//获取应用实例
const app = getApp();
const db = wx.cloud.database();
import uuid from '../../utils/uuid';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      text_data: [],
      text: '',
      text_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.text_id = options.textid || '';
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
    let that = this;
    let _openid =  wx.getStorageSync('openid');
    if (!that.data.text_id) {
      wx.showToast({
        title: 'textid丢失',
        icon: 'error',
        duration: 2000
      })
      return;
    }
    db.collection('todos_' + _openid).where({
      _id: that.data.text_id
    }).get().then(res => {
      console.log('text', res)
      if (res.errMsg === 'collection.get:ok') {
        this.setData({
          text: res.data.length ? res.data[0].copyText : []
        })
      }
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