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
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      scrollHeight: scrollHeight
    });
    this.setData({
        skipCount: 0,
        recording_text: []
    });
    this.getRecording();
    console.log('设置data', this.data.skipCount)
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
    let _openid =  wx.getStorageSync('openid');
    const MAX_LIMIT = 10;
    this.getCollectionCount(_openid);
    wx.showLoading({
      title: '加载中',
    })
    const db = wx.cloud.database();
    console.log('skipCount',that.data.skipCount)
    db.collection('todos_'+_openid).skip(that.data.skipCount * MAX_LIMIT).limit(10).get().then(res => {
      wx.hideLoading();
      if (res.errMsg !== 'collection.get:ok') {
        return;
      }
      console.log(res)
      let _data = res.data.length && res.data.filter((item, index) => {
        if (item.copyText) {
          item.isCheck = false;
          item.copyText = item.copyText.slice(0,40);
          return item;
        }
      });
      //  通点问题   下拉加载分页 需要合并数组 但是 下拉刷新得时候 不能 进行合并 
      that.setData({
        recording_text: _data ? dataCopy.concat(_data) : _data
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
    let _openid =  wx.getStorageSync('openid');
    wx.showModal({
      title: '是否要删除记录',
      content:'删除后识别记录将无法恢复',
      success (res) {
        if (!res.confirm) {
          return;
        }
        if (!that.data.checkVal.length) {
          wx.showToast({
            title: '请选择识别记录',
            icon: "error"
          })
          return;
        }
        getApp().callCloud("delete", {
            checkVal: that.data.checkVal,
            openid: _openid
          }, res=>{
            if (res.errMsg === 'cloud.callFunction:ok') {
              wx.showToast({
                title: '删除成功',
              })
              that.handleReset();
              that.getRecording();
            }
            console.log('delete',res)
        })
      }
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
    let _openid =  wx.getStorageSync('openid');
    if (that.data.artickeThrottle) return;
    that.getCollectionCount(_openid)
    that.data.artickeThrottle = true;
    setTimeout(() => {that.data.artickeThrottle = false}, 4000);
    that.data.scrollCount++;
    console.log('countResult',that.data.countResult)
    if (that.data.countResult.total < 10 || that.data.scrollCount > that.data.skipCount) {
      return 
    }
    this.getRecording();
  },
  async getCollectionCount(openid) {
    const db = wx.cloud.database();
    const countResult = await db.collection('todos_' +openid).count()
    const batchTimes = Math.ceil(countResult.total / 100)
    console.log('batchTimes', batchTimes, this.data.skipCount)

    this.setData({
      skipCount: batchTimes,
      countResult: countResult
    })

  },
  handlerefresherrefresh() {
    this.handleReset();
    this.getRecording();
    let that = this;
    setTimeout(() => {
      that.setData({
        refreFlage: false
      })
    },1000)
  },
  // 跳转到详情页
  handleDetails(event) {
    console.log(event)
    let _id = event.target.dataset.id || '';
    if (!_id) {
      return;
    }
    wx.navigateTo({
        url: `/pages/text/text?textid=${_id}`
    })
  },
  // 重置数据
  handleReset() {
    this.setData({
      skipCount: 0,
      scrollCount: 0,
      recording_text: []
    });
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