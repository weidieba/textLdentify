// pages/recording/recording.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    recording_text: [],
    checkVal: [],
    scrollHeight: '',
    artickeThrottle: false,
    skipCount: 0,
    scrollCount: 0,
    countResult: {},
    refreFlage: true
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
    this.getRecording();
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      scrollHeight: scrollHeight
    });
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
  // 获取查询的识别记录
  getRecording() {
    let that = this;
    let dataCopy = that.data.recording_text;
    const MAX_LIMIT = 10;
    this.getCollectionCount();
    wx.showLoading({
      title: '加载中',
    })
    const db = wx.cloud.database();
    db.collection('todos').skip(that.data.skipCount * MAX_LIMIT).limit(10).get().then(res => {
      wx.hideLoading();
      if (res.errMsg !== 'collection.get:ok') {
        return;
      }
      let _data = res.data.length && res.data.filter((item, index) => {
        if (item.copyText) {
          item.isCheck = false;
          item.copyText = item.copyText.slice(0,40);
          return item;
        }
      });
      that.setData({
        recording_text: dataCopy.concat(_data)
      })
    }).catch(err => {
      console.error(err);
      wx.hideLoading();
    })
  },
  handleChage(val) {
    this.setData({
      checkVal: val.detail.value
    })
  },
  handleDelete() {
    let that = this;
    if (!this.data.checkVal.length) {
      wx.showToast({
        title: '请选择识别记录',
        icon: "error"
      })
      return;
    }
    getApp().callCloud("delete", {
        checkVal: that.data.checkVal
      }, res=>{
        if (res.errMsg === 'cloud.callFunction:ok') {
          wx.showToast({
            title: '删除成功',
          })
          that.getRecording();
        }
        console.log('delete',res)
    })
  },
  handleAllSelect() {
    let allData = this.data.recording_text || [];
    let allId = []
    allData.length && allData.forEach(item => {
      item.isCheck = !item.isCheck || false;
      allId.push(item._id)
    })
    this.setData({
      recording_text: allData,
      checkVal: allId
    })
  },
  handleScrollBottom() {
    let that = this;
    let count = 0;
    if (that.data.artickeThrottle) return;
    that.data.artickeThrottle = true;
    setTimeout(() => {that.data.artickeThrottle = false}, 4000);
    that.data.scrollCount++;
    if (that.data.scrollCount > that.data.skipCount) {
      return 
    }
    this.getRecording();
  },
  async getCollectionCount() {
    const db = wx.cloud.database();
    const countResult = await db.collection('todos').count()
    console.log(countResult)
    const batchTimes = Math.ceil(countResult.total / 100)
    this.setData({
      skipCount: batchTimes,
      countResult: countResult
    })

  },
  handlerefresherrefresh() {
    this.getRecording();
    let that = this;
    setTimeout(() => {
      that.setData({
        refreFlage: false
      })
    },1000)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log(123123)
    onsole.log('我就想看看这个方法触发了没有');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})