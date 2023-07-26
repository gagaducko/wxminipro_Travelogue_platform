// pages/savePost/savePost.js
var util = require("../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        content: "",
        theme: wx.getSystemInfoSync().theme,
        type: 1,
        userinfo: {},
        tempFilePaths: '',
        title: '请输入标题', // 标题
        summary: '请输入简介', // 摘要
        type1: "打个标签吧",
        type2: "再打个标签吧",
        coverImg: "",
        isImage: false,
        aid: 0,
        adid: 0,
        mainType: 0,
        typeArray: ["攻略", "旅游记录", "心得体会"]
    },

    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        var a = e.detail.value
        switch (a) {
            case "0":
                this.setData({
                    mainType: 0
                })
                break;
            case "1":
                this.setData({
                    mainType: 1
                })
                break;
            case "2":
                this.setData({
                    mainType: 2
                })
                break;
            default:
                console.log("wrong here")
                break;
        }
    },

    chooseimage: function chooseimage() {
        var _this = this;
        wx.chooseImage({
            count: 1, // 默认9  
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success: function success(res) {
                console.log("res for it is:", res);
                wx.showToast({
                    title: '正在上传...',
                    icon: 'loading',
                    mask: true,
                    duration: 1000
                });
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
                _this.setData({
                    tempFilePaths: res.tempFilePaths,
                    isImage: true
                });
                console.log(res.tempFilePaths);
            }
        });
    },

    seeIfOk() {
        if (this.data.isImage == false) {
            wx.showToast({
                title: '请选择封面',
            })
            return false;
        } else if (this.data.title == "") {
            wx.showToast({
                title: '请输入标题',
            })
            return false;
        } else if (this.data.summary == "") {
            wx.showToast({
                title: '请输入简介',
            })
            return false;
        } else if (this.data.type1 == "" || this.data.type2 == "") {
            wx.showToast({
                title: '请输入标签',
            })
            return false;
        }
        return true;
    },

    updateIt() {
        const that = this;
        var datatime = util.formatTime(new Date());
        console.log("now time is:", datatime)
        if (this.seeIfOk()) {
            var a;
            wx.uploadFile({
                //被上传的文件的路径
                filePath: that.data.tempFilePaths[0],
                //上传的文件的名称 后台来获取文件 file,也即请求参数
                name: 'image',
                //图片要上传的后端接口地点
                url: 'http://server/image/upload/uploadPic',
                //顺带的文本信息
                formData: {},
                success: (result) => {
                    console.log("after update:", result.data);
                    //获取到后端返回的图片路径
                    that.setData({
                        coverImg: result.data
                    }, () => {
                        wx.request({
                            method: 'PUT',
                            url: "http://server/database/article/" + that.data.aid,
                            data: {
                                "title": that.data.title,
                                "coverImg": that.data.coverImg,
                                "viewNum": 0,
                                "starNum": 0,
                                "openid": that.data.userinfo.openid,
                                "stat": 0,
                                "date": datatime,
                                "type1": that.data.type1,
                                "type2": that.data.type2,
                                "summary": that.data.summary,
                                "mainType": that.data.mainType,
                                "isSuper": 0
                            },
                            header: {
                                'content-type': 'application/json' // 默认值
                            },
                            success(res) {
                                console.log("success:", res.data.data.id);
                                // 把这个东西的内容传上去（content）
                                wx.request({
                                    method: 'PUT',
                                    url: "http://server/database/ArticleDetail/" + that.data.adid,
                                    data: {
                                        content: that.data.content,
                                        OAOD: {
                                            id: res.data.data.id
                                        }
                                    },
                                    header: {
                                        'content-type': 'application/json' // 默认值
                                    },
                                    success(res) {
                                        console.log("success:", res.data);
                                        wx.showToast({
                                            title: '保存成功！',
                                        })
                                        setTimeout(() => {
                                            console.log("now is time back")
                                            wx.switchTab({
                                                url: '/pages/more/more',
                                            })
                                        }, 500)
                                    },
                                    fail(res) {
                                        console.log("fail:", res);
                                    }
                                })
                            },
                            fail(res) {
                                console.log("fail:", res);
                            }
                        })
                    })
                },
            })
        } else {
            console.log("不行！")
        }
    },



    describeIt() {
        wx.requestSubscribeMessage({
            tmplIds: ['JWpcFLkxnWJ2g7sCM-IV6cL3viIH_krlIp1gkr2-rrY'],
            success(res) {
                console.log(res)
            }
        })
    },

    updatePostIt() {
        const that = this;
        var datatime = util.formatTime(new Date());
        console.log("now time is:", datatime)
        if (this.seeIfOk()) {
            var a;
            wx.uploadFile({
                //被上传的文件的路径
                filePath: that.data.tempFilePaths[0],
                //上传的文件的名称 后台来获取文件 file,也即请求参数
                name: 'image',
                //图片要上传的后端接口地点
                url: 'http://server/image/upload/uploadPic',
                //顺带的文本信息
                formData: {},
                success: (result) => {
                    console.log("after update:", result.data);
                    //获取到后端返回的图片路径
                    that.setData({
                        coverImg: result.data
                    }, () => {
                        wx.request({
                            method: 'PUT',
                            url: "http://server/database/article/" + that.data.aid,
                            data: {
                                "title": that.data.title,
                                "coverImg": that.data.coverImg,
                                "viewNum": 0,
                                "starNum": 0,
                                "openid": that.data.userinfo.openid,
                                "stat": 1,
                                "date": datatime,
                                "type1": that.data.type1,
                                "type2": that.data.type2,
                                "summary": that.data.summary,
                                "mainType": that.data.mainType,
                                "isSuper": 0
                            },
                            header: {
                                'content-type': 'application/json' // 默认值
                            },
                            success(res) {
                                console.log("success:", res.data.data.id);
                                // 把这个东西的内容传上去（content）
                                wx.request({
                                    method: 'PUT',
                                    url: "http://server/database/ArticleDetail/" + that.data.adid,
                                    data: {
                                        content: that.data.content,
                                        OAOD: {
                                            id: res.data.data.id
                                        }
                                    },
                                    header: {
                                        'content-type': 'application/json' // 默认值
                                    },
                                    success(res) {
                                        console.log("success:", res.data);
                                        wx.showToast({
                                            title: '保存成功！',
                                        })
                                        setTimeout(() => {
                                            console.log("now is time back")
                                            wx.switchTab({
                                                url: '/pages/more/more',
                                            })
                                        }, 500)
                                    },
                                    fail(res) {
                                        console.log("fail:", res);
                                    }
                                })
                            },
                            fail(res) {
                                console.log("fail:", res);
                            }
                        })
                    })
                },
            })
        } else {
            console.log("不行！")
        }
    },

    saveIt() {
        const that = this;
        var datatime = util.formatTime(new Date());
        console.log("now time is:", datatime)
        if (this.seeIfOk()) {
            var a;
            wx.uploadFile({
                //被上传的文件的路径
                filePath: that.data.tempFilePaths[0],
                //上传的文件的名称 后台来获取文件 file,也即请求参数
                name: 'image',
                //图片要上传的后端接口地点
                url: 'http://server/image/upload/uploadPic',
                //顺带的文本信息
                formData: {},
                success: (result) => {
                    console.log("after update:", result.data);
                    //获取到后端返回的图片路径
                    that.setData({
                        coverImg: result.data
                    }, () => {
                        wx.request({
                            method: 'POST',
                            url: "http://server/database/article",
                            data: {
                                "title": that.data.title,
                                "coverImg": that.data.coverImg,
                                "viewNum": 0,
                                "starNum": 0,
                                "openid": that.data.userinfo.openid,
                                "stat": 0,
                                "date": datatime,
                                "type1": that.data.type1,
                                "type2": that.data.type2,
                                "summary": that.data.summary,
                                "mainType": that.data.mainType,
                                "isSuper": 0
                            },
                            header: {
                                'content-type': 'application/json' // 默认值
                            },
                            success(res) {
                                console.log("success:", res.data);
                                // 把这个东西的内容传上去（content）
                                wx.request({
                                    method: 'POST',
                                    url: "http://server/database/ArticleDetail/",
                                    data: {
                                        content: that.data.content,
                                        OAOD: {
                                            id: res.data.data.id
                                        }
                                    },
                                    header: {
                                        'content-type': 'application/json' // 默认值
                                    },
                                    success(res) {
                                        console.log("success:", res.data);
                                        wx.showToast({
                                            title: '保存成功！',
                                        })
                                        setTimeout(() => {
                                            console.log("now is time back")
                                            wx.switchTab({
                                                url: '/pages/more/more',
                                            })
                                        }, 500)
                                    },
                                    fail(res) {
                                        console.log("fail:", res);
                                    }
                                })
                            },
                            fail(res) {
                                console.log("fail:", res);
                            }
                        })
                    })
                },
            })
        } else {
            console.log("不行！")
        }
    },

    postIt() {
        // this.describeIt();
        const that = this;
        wx.requestSubscribeMessage({
            tmplIds: ['JWpcFLkxnWJ2g7sCM-IV6cL3viIH_krlIp1gkr2-rrY'],
            success(res) {
                console.log(res)
            }
        }, () => {
            var datatime = util.formatTime(new Date());
            console.log("now time is:", datatime)
            if (that.seeIfOk()) {
                wx.uploadFile({
                    //被上传的文件的路径
                    filePath: that.data.tempFilePaths[0],
                    //上传的文件的名称 后台来获取文件 file,也即请求参数
                    name: 'image',
                    //图片要上传的后端接口地点
                    url: 'http://server/image/upload/uploadPic',
                    //顺带的文本信息
                    formData: {},
                    success: (result) => {
                        console.log("after update:", result.data);
                        //获取到后端返回的图片路径
                        that.setData({
                            coverImg: result.data
                        }, () => {
                            wx.request({
                                method: 'POST',
                                url: "http://server/database/article",
                                data: {
                                    "title": that.data.title,
                                    "coverImg": that.data.coverImg,
                                    "viewNum": 0,
                                    "starNum": 0,
                                    "openid": that.data.userinfo.openid,
                                    "stat": 1,
                                    "date": datatime,
                                    "type1": that.data.type1,
                                    "type2": that.data.type2,
                                    "summary": that.data.summary,
                                    "mainType": that.data.mainType,
                                    "isSuper": 0
                                },
                                header: {
                                    'content-type': 'application/json' // 默认值
                                },
                                success(res) {
                                    console.log("success:", res.data.data.id);
                                    // 把这个东西的内容传上去（content）
                                    wx.request({
                                        method: 'POST',
                                        url: "http://server/database/ArticleDetail/",
                                        data: {
                                            content: that.data.content,
                                            OAOD: {
                                                id: res.data.data.id
                                            }
                                        },
                                        header: {
                                            'content-type': 'application/json' // 默认值
                                        },
                                        success(res) {
                                            console.log("success:", res.data);
                                            wx.showToast({
                                                title: '等待审核！',
                                            })
                                            setTimeout(() => {
                                                console.log("now is time back")
                                                wx.switchTab({
                                                    url: '/pages/more/more',
                                                })
                                            }, 500)
                                        },
                                        fail(res) {
                                            console.log("fail:", res);
                                        }
                                    })
                                },
                                fail(res) {
                                    console.log("fail:", res);
                                }
                            })
                        })
                    },
                })
            } else {
                console.log("不行！")
            }
        })
    },

    getInputValueTitle(e) {
        console.log(e.detail)
        this.setData({
            title: e.detail.value
        })
    },

    getInputValueSummary(e) {
        console.log(e.detail)
        this.setData({
            summary: e.detail.value
        })
    },

    getInputValueTypeOne(e) {
        console.log(e.detail)
        this.setData({
            type1: e.detail.value
        })
    },

    getInputValueTypeTwo(e) {
        console.log(e.detail)
        this.setData({
            type2: e.detail.value
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log("now is onLoad", options)
        const ui = wx.getStorageSync('userinfo')
        var content = wx.getStorageSync('contentTmp');
        console.log("content is:", content)
        var aid = 0
        var adid = 0
        if ((options.aid != null) && (options.adid != null)) {
            aid = options.aid
            adid = options.adid
            wx.request({
                method: "GET",
                url: 'http://server/database/article/' + aid,
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    console.log("for ir :", res.data.data)
                    that.setData({
                        title: res.data.data.title,
                        summary: res.data.data.summary,
                        type1: res.data.data.type1,
                        type2: res.data.data.type2,
                        tempFilePaths: res.data.data.coverImg,
                        coverImg: res.data.data.coverImg,
                        mainType: res.data.data.mainType
                    })
                },
            })
        }
        let that = this
        that.setData({
            userinfo: ui,
            content: content,
            type: options.type,
            aid: aid,
            adid: adid
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})