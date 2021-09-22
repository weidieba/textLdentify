// app.js
App({
  onLaunch() {
    let that = this;
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
  globalData: {
    imgSrc: '',
    textData:  [{
		"words": "公司端午节放假通知"
	}, {
		"words": "2021年端午节将至,根据国家法定假期规定,"
	}, {
		"words": "现对端午节假期作如下安排:"
	}, {
		"words": "放假时间:2020年6月12日(星期六)至"
	}, {
		"words": "2020年6月14日(星期一)共放假3天,6月15日"
	}, {
		"words": "(周二)正常上班"
	}, {
		"words": "、请各部门负责人做好节前的工作安排,检查"
	}, {
		"words": "相关设施、设备,做好防火、防盗工作,确保办公场"
	}, {
		"words": "所的安全、有序"
	}, {
		"words": "三、全体员工在假期间,尽量保持24小时手机开"
	}, {
		"words": "机,遇到突发事件及时上报,并妥善处理。"
	}, {
		"words": "温馨提示:疫情仍需重视,大家出门请务必戴好"
	}, {
		"words": "口罩,做好防护。"
	}, {
		"words": "请各位伙伴相互告知"
	}, {
		"words": "提前祝大家端午节假期愉快"
	}, {
		"words": "特此通知!"
	}],
  }
})
