//获取应用实例
const app = getApp()
import uuid from '../../utils/uuid';
Page({
    data: {
        src: '',
        width: 350, //宽度
        height: 500, //高度
        max_width: 900,
        max_height: 900,
        disable_rotate: true, //是否禁用旋转
        disable_ratio: false, //锁定比例
        limit_move: true, //是否限制移动
    },
    onLoad: function (options) {
        this.cropper = this.selectComponent("#image-cropper");
        this.setData({
            src: options.imgSrc
        });
        if(!options.imgSrc){
            this.cropper.upload(); //上传图片
        }
        
    },
    cropperload(e) {
        console.log('cropper加载完成');
    },
    loadimage(e) {
        wx.hideLoading();
        this.cropper.imgReset();
    },
    clickcut(e) {
        console.log(e.detail);
        //图片预览
        wx.previewImage({
            current: e.detail.url, // 当前显示图片的http链接
            urls: [e.detail.url] // 需要预览的图片http链接列表
        })
    },
    upload() {
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                wx.showLoading({
                    title: '加载中',
                })
                const tempFilePaths = res.tempFilePaths[0];
                //重置图片角度、缩放、位置
                that.cropper.imgReset();
                that.setData({
                    src: tempFilePaths
                });
            }
        })
    },
    setWidth(e) {
        this.setData({
            width: e.detail.value < 10 ? 10 : e.detail.value
        });
        this.setData({
            cut_left: this.cropper.data.cut_left
        });
    },
    setHeight(e) {
        this.setData({
            height: e.detail.value < 10 ? 10 : e.detail.value
        });
        this.setData({
            cut_top: this.cropper.data.cut_top
        });
    },
    switchChangeDisableRatio(e) {
        //设置宽度之后使剪裁框居中
        this.setData({
            disable_ratio: e.detail.value
        });
    },
    setCutTop(e) {
        this.setData({
            cut_top: e.detail.value
        });
        this.setData({
            cut_top: this.cropper.data.cut_top
        });
    },
    setCutLeft(e) {
        this.setData({
            cut_left: e.detail.value
        });
        this.setData({
            cut_left: this.cropper.data.cut_left
        });
    },
    switchChangeDisableRotate(e) {
        //开启旋转的同时不限制移动
        if (!e.detail.value) {
            this.setData({
                limit_move: false,
                disable_rotate: e.detail.value
            });
        } else {
            this.setData({
                disable_rotate: e.detail.value
            });
        }
    },
    switchChangeLimitMove(e) {
        //限制移动的同时锁定旋转
        if (e.detail.value) {
            this.setData({
                disable_rotate: true
            });
        }
        this.cropper.setLimitMove(e.detail.value);
    },
    switchChangeDisableWidth(e) {
        this.setData({
            disable_width: e.detail.value
        });
    },
    switchChangeDisableHeight(e) {
        this.setData({
            disable_height: e.detail.value
        });
    },
    submit() {
        let access_token = wx.getStorageSync("access_token");
        this.cropper.getImg((obj) => {
            app.globalData.imgSrc = obj.url;
            if (!access_token) {
                getApp().getAccessToken().then(res => {
                    res && this.selectImage(res.data.access_token, obj.url)
                })
            } else {
                this.selectImage(access_token, obj.url)
            }   
        });
    },
    selectImage(accessToken, url) {
        let img_base = '';
        let that = this;
        let id = 'text' + uuid();
        img_base = wx.getFileSystemManager().readFileSync(url, "base64");
        wx.showLoading({
            title: '加载中',
        })
        let _openid =  wx.getStorageSync('openid');
        img_base && wx.request({
            url: `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${accessToken.token}`,
            method: 'POST',
            header: {
                "content-type": 'application/x-www-form-urlencoded'
            },
            data: {
                image: img_base,
                detect_direction: "true"
            },
            success(res) {
                console.log(res);
                wx.hideLoading();
                if (!res.data.words_result.length) {
                    wx.showToast({
                        icon: "error",
                        title: '图片内无文字',
                    });
                    return;
                }
                app.globalData.textData = res.data.words_result;
                let data =res.data.words_result.length && res.data.words_result.reduce((pre, net) => {
                    net.words && (pre += net.words)
                    return pre
                }, '')
                // 云函数创建数据 
                getApp().callCloud("create", {
                    _id: id,
                    copyText: data,
                    openid: _openid
                }, res=>{
                    console.log(res)
                })
                
                wx.navigateTo({
                    url: `/pages/text/text`
                }) 
            },
            fail(err) {
                console.log(err);
                wx.hideLoading();
            }
        })
    },
    rotate() {
        //在用户旋转的基础上旋转90°
        this.cropper.setAngle(this.cropper.data.angle += 90);
    },
    top() {
        this.data.top = setInterval(() => {
            this.cropper.setTransform({
                y: -3
            });
        }, 1000 / 60)
    },
    bottom() {
        this.data.bottom = setInterval(() => {
            this.cropper.setTransform({
                y: 3
            });
        }, 1000 / 60)
    },
    left() {
        this.data.left = setInterval(() => {
            this.cropper.setTransform({
                x: -3
            });
        }, 1000 / 60)
    },
    right() {
        this.data.right = setInterval(() => {
            this.cropper.setTransform({
                x: 3
            });
        }, 1000 / 60)
    },
    narrow() {
        this.data.narrow = setInterval(() => {
            this.cropper.setTransform({
                scale: -0.02
            });
        }, 1000 / 60)
    },
    enlarge() {
        this.data.enlarge = setInterval(() => {
            this.cropper.setTransform({
                scale: 0.02
            });
        }, 1000 / 60)
    },
    end(e) {
        clearInterval(this.data[e.currentTarget.dataset.type]);
    },
})