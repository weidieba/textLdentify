// app.js
App({
  onLaunch() {
    let that = this;
    //  百度云文字识别
    let expire_time = wx.getStorageSync("access_token");
    if (!expire_time.token) {
        that.getAccessToken()
    }
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
