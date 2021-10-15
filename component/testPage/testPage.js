// pages/testPage/testPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasWidth: null,
    swiperList: [
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp03%2F1Z920154K520Z-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636870386&t=f64d4354d6028e483f21ff538b3618f6',
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwx1.sinaimg.cn%2Fmw690%2F0074FH44ly1guekkysqlvj60to0s043o02.jpg&refer=http%3A%2F%2Fwx1.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636870413&t=a9d37b374a6c573aae4ec5db9d2ec680',
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fww3.sinaimg.cn%2Fmw690%2F005MKxiRly1gvb6nuayzrj60u00u07bj02.jpg&refer=http%3A%2F%2Fwww.sina.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636870478&t=4c9989fb5fd31f69916e88faaef9f109',
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwx3.sinaimg.cn%2Fmw690%2F0074FH44ly1guekkz8e1mj60to0kljus02.jpg&refer=http%3A%2F%2Fwx3.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636870509&t=7e28172ace876763c877667c90cd9e80'
    ],
    cardCur: 0,                       // swiper索引
    indicatorShow: true,              // 是否展示指示器
    indicatorColor: '#FFFFFF',        // 指示器未选中颜色
    indicatorActiveColor: '#dc77b8',  // 指示器选中颜色
    circular: true,                   // 是否无缝衔接
    autoplay: true,                   // 是否自动切换item
    interval: 2000,                   // 自动切换间隔
    duration: 500,                    // 切换动画时长
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // setTimeout(() => {
    //   this.drawCanvas()
    // }, 2000)
    
  },

  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },

  drawCanvas() {
    let _this = this
    const query = wx.createSelectorQuery()
    query
      .select('#myCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            ctx.scale(0.7, 0.3)
            const headerImg = canvas.createImage()
            let imgWidth = _this.data.canvasWidth
            headerImg.src = '/images/xingkong-bg.jpg'
            headerImg.onload = () => {
              ctx.drawImage(headerImg, 0, 0, imgWidth, imgWidth / 2)
            }
        })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      canvasWidth: wx.getSystemInfoSync().windowWidth
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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