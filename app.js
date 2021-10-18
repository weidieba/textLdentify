// app.js
var cloudInited = false;
App({
  onLaunch() {
    let that = this;
    wx.cloud.init()
    // 新版本自动提醒更新
    that.updateVersion();
    //  百度云文字识别
    let expire_time = wx.getStorageSync("access_token");
    if (!expire_time.token) {
        that.getAccessToken()
    }
    
    //  有token 并且 去判断时间
    expire_time.token && that.setAccessToken();
  },
  onShow() {
    // 新版本自动提醒更新 冷启动时无法触发 onlauch 故再次重新调用版本
    this.updateVersion();
  },
  getAccessToken() {
      let current_time = 	Math.round(new Date() / 1000);
      return new Promise((resolve) => {
          wx.request({
              url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=cB5vRjdjOvD9qTGrBF3ERjPY&client_secret=6F5upL9uTW3Fth5KSCv1tQTEMb97IEky',
              method: 'POST',
              success: function (response) {
                  if (response.errMsg === "request:ok") {
                      console.log(response)
                      wx.setStorageSync('access_token', {
                          token: response.data.access_token,
                          expireIn: response.data.expires_in,
                          time: current_time
                      })
                  }
                  resolve(response);
              },
              fail: function(err) {
                  console.log(err)
                  resolve(false);
              }
          })
      })
  },
    // app.js   封装了全局函数
    /**
     * 调用云函数
     * @param {*} name         云函数名称
     * @param {*} data          参数
     * @param {*} callBack 
     */
    callCloud  (name, data, callBack){
        if(!cloudInited) {
            wx.cloud.init();
            cloudInited = true
        }
        console.debug(`开始执行云函数调用 name=${name} ...`)
        wx.cloud.callFunction({
            name,
            data,
            success: (res)=>{
                console.debug(`来自云函数${name}的调用结果：`, res)
                callBack(res)
            },
            fail: err=>{
                console.error("云函数调用失败", err.errCode, err.errMsg)
            }
        })
    },
  setAccessToken() {
      console.log('执行了')
    //  获取当前时间判断是否为存储accesstoken的30天后 如果是 重新写入accesstoken
    let current_time = 	Math.round(new Date() / 1000);
    let access_time = wx.getStorageSync("access_token");
    if (current_time > access_time.time * 1000 * 60 * 60 * 24 * 30) {
        that.getAccessToken();
    }
  },
  updateVersion() {
    var self = this;
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //2. 小程序有新版本，则静默下载新版本，做好更新准备
          updateManager.onUpdateReady(function() {
            updateManager.applyUpdate()
          })
          updateManager.onUpdateFailed(function() {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  getCloudUserInfo() {
    return new Promise((reslove) => {
        this.callCloud("userInfo", {}, res=>{
            console.log('userInfo',res)
            if (res.errMsg === 'cloud.callFunction:ok') {
                wx.setStorageSync('openid', res.result.OPENID);
                reslove(res.result);
            }
        })
    })
  },
  globalData: {
    imgSrc: '',
    textData:  [],
  }
})
