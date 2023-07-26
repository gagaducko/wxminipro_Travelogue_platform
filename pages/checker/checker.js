// pages/checker/checker.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        context: "",
        aid: 0,
        adid: 0,
        readOnly: false,
        type: 1,
        isMain: 0,
        isSuper: 0,
        ui: {}
    },

    readOnlyChange() {
        this.setData({
            readOnly: !this.data.readOnly
        })
    },

    // 将编辑器内的图片保存到资源中去
    savePics(v) {
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                //被上传的文件的路径 
                filePath: v,
                //上传的文件的名称 后台来获取文件 file,也即请求参数 
                name: 'image',
                //图片要上传的后端接口地点 
                url: 'http://server/image//upload/uploadPic',
                //顺带的文本信息 
                formData: {},
                success: (result) => {
                    console.log("result is:", result);
                    //获取到后端返回的图片路径 
                    let url = result.data;
                    resolve(url);
                },
                fail: (res) => {
                    console.log("result is fail:", res)
                    reject(new Error("Failed to upload image"))
                }
            })
        });
    },

    postContent() {
        const that = this;
        this.editorCtx.getContents({
            success: function (res) {
                console.log("success here")
                console.log(res)
                console.log(res.delta)
                var content = JSON.stringify(res.delta);
                wx.setStorageSync('contentTmp', content)
                wx.navigateTo({
                    url: '/pages/savePost/savePost?type=4' + '&aid=' + that.data.aid + '&adid=' + that.data.adid
                })
            },
            fail: function (error) {
                console.log("error here")
                console.log(error)
            }
        })
    },

    seeIt() {
        wx.navigateTo({
            url: '/pages/notPass/notPass?type=2&aid=' + this.data.aid,
        })
    },

    slider3change(e) {
        this.setData({
            isSuper: e.detail.value
        })
    },

    passIt() {
        const that = this;
        wx.request({
            method: 'GET',
            url: 'http://server/database/article/?article.id=' + this.data.aid,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.data.data[0])
                var newData = res.data.data[0]
                console.log(newData)
                wx.request({
                    method: 'PUT',
                    url: 'http://server/database/article/' + that.data.aid,
                    data: {
                        "title": newData.title,
                        "coverImg": newData.coverImg,
                        "viewNum": 0,
                        "starNum": 0,
                        "openid": newData.openid,
                        "stat": 2,
                        "date": newData.date,
                        "type1": newData.type1,
                        "type2": newData.type2,
                        "summary": newData.summary,
                        "mainType": newData.mainType,
                        "isSuper": (that.data.isSuper / 10)
                    },
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success(res) {
                        console.log(res)
                    },
                    fail(res) {

                    }
                })
            },
            fail(res) {

            }
        })
        wx.request({
            method: 'GET',
            url: 'http://server/database/editor/?editor.openid=' + that.data.ui.openid,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log("res:", res.data.data[0])
                var id = res.data.data[0].id
                var openid = res.data.data[0].openid
                var isOk = res.data.data[0].isOk
                var assessNum = res.data.data[0].assessNum + 1
                wx.request({
                    method: 'PUT',
                    url: 'http://server/database/editor/' + id,
                    data: {
                        "openid": openid,
                        "isOk": isOk,
                        "assessNum": assessNum
                    },
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success(res) {
                        console.log(res)
                    },
                    fail(res) {

                    }
                })
            },
            fail(res) {}
        })
        wx.request({
            method: 'POST',
            url: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=68_CfFbIZIyzCZ3UBrFKtYX85T86HQ7YMQAHFoo0RS7254a_XlQ-CqeChMlZbf7BecYW7UjgNB_Te40NBZJOWPxQVPeRnidH5lQr95oJeVNjm6errKvq_8PjiRbHjgXDDdABAGMM',
            header: {
                'content-type': 'application/json' // 默认值
            },
            data: {
                "touser": "owtca5LRdmJAqHT5LhiDDLcfpwh4",
                "template_id": "JWpcFLkxnWJ2g7sCM-IV6cL3viIH_krlIp1gkr2-rrY",
                "page": "index",
                "data": {
                    "thing5": {
                        "value": "this is test 1"
                    },
                    "name4": {
                        "value": "nihao"
                    },
                    "thing2": {
                        "value": "审核通过"
                    } ,
                    "thing3": {
                        "value": "审核通过"
                    },
                    "date6": {
                        "value": "2023/5/21"
                    }
                }
              }
        })
        wx.showToast({
            title: '审核成功！',
        })
        wx.navigateBack({
            delta: 0,
        })
    },


    sentIt() {
        const that = this;
        wx.request({
            method: 'GET',
            url: 'http://server/database/article/?article.id=' + this.data.aid,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.data.data[0])
                var newData = res.data.data[0]
                console.log(newData)
                wx.request({
                    method: 'PUT',
                    url: 'http://server/database/article/' + that.data.aid,
                    data: {
                        "title": newData.title,
                        "coverImg": newData.coverImg,
                        "viewNum": 0,
                        "starNum": 0,
                        "openid": newData.openid,
                        "stat": 3,
                        "date": newData.date,
                        "type1": newData.type1,
                        "type2": newData.type2,
                        "summary": newData.summary,
                        "mainType": newData.mainType,
                        "isSuper": (that.data.isSuper / 10)
                    },
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success(res) {
                        console.log(res)
                        wx.showToast({
                            title: '上报成功！',
                        }, () => {
                            wx.navigateBack({
                                delta: 0,
                            })
                        })
                    },
                    fail(res) {

                    }
                })
            },
            fail(res) {

            }
        })
    },

    insertImage() {
        const that = this
        wx.chooseImage({
            count: 1,
            success: function (res) {
                wx.uploadFile({
                    //被上传的文件的路径 
                    filePath: res.tempFilePaths[0],
                    //上传的文件的名称 后台来获取文件 file,也即请求参数 
                    name: 'image',
                    //图片要上传的后端接口地点 
                    url: 'http://server/image//upload/uploadPic',
                    //顺带的文本信息 
                    formData: {},
                    success: (result) => {
                        console.log("result is:", result);
                        //获取到后端返回的图片路径 
                        that.editorCtx.insertImage({
                            src: result.data,
                            data: {
                                id: 'abcd',
                                role: 'god'
                            },
                            width: '80%',
                            success: function () {
                                console.log('insert image success')
                            }
                        })
                    },
                    fail: (res) => {
                        console.log("result is fail:", res)
                        reject(new Error("Failed to upload image"))
                    }
                })
            }
        })
    },

    // 删除
    backMore() {
        wx.request({
            method: 'DELETE',
            url: 'http://server/database/ArticleDetail/' + this.data.adid,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log("now is success DELETE res", res.data)
            },
            fail(res) {
                console.log("now is fail", res.data.DATA[0])
            }
        })
        wx.request({
            method: 'DELETE',
            url: 'http://server/database/article/' + this.data.aid,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log("now is success DELETE res", res.data)
            },
            fail(res) {
                console.log("now is fail", res.data.DATA[0])
            }
        })
        wx.navigateBack({
            delta: 0,
        })
    },

    getContextNew(id) {
        const that = this
        wx.request({
            method: 'GET',
            url: 'http://server/database/ArticleDetail/?ArticleDetail.OAOD.id=' + id,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.data.data[0]);
                var contentNew = res.data.data[0].content;
                that.setData({
                    context: contentNew,
                    adid: res.data.data[0].id
                }, () => {
                    var content = JSON.parse(res.data.data[0].content);
                    var query = wx.createSelectorQuery(); //创建节点查询器 
                    query.in(that).select('#editor').context(function (res) {
                        res.context.setContents({
                            delta: content,
                            success: function (res) {
                                console.log(res.data)
                            },
                            fail: function (error) {
                                console.log(error)
                            }
                        })
                    }).exec()
                })
            },
            fail(res) {
                console.log(res);
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options)
        const platform = wx.getSystemInfoSync().platform
        const isIOS = platform === 'ios'
        var ui = wx.getStorageSync('userinfo')
        this.setData({
            ui: ui,
            isIOS
        })
        this.updatePosition(0)
        let keyboardHeight = 0
        wx.onKeyboardHeightChange(res => {
            if (res.height === keyboardHeight) return
            const duration = res.height > 0 ? res.duration * 1000 : 0
            keyboardHeight = res.height
            setTimeout(() => {
                wx.pageScrollTo({
                    scrollTop: 0,
                    success() {
                        that.updatePosition(keyboardHeight)
                        that.editorCtx.scrollIntoView()
                    }
                })
            }, duration)
        })
        if (options.type == 1) {
            this.getContextNew(options.id)
            this.setData({
                type: 1,
                readOnly: true,
                aid: options.id,
                isMain: options.isMain
            })
        }
        if (options.type == 2) {
            this.getContextNew(options.id)
            this.setData({
                type: 2,
                readOnly: false,
                aid: options.id
            })
        }
    },

    notPass() {
        const that = this
        var ui = wx.getStorageSync('userinfo')
        this.setData({
            ui: ui
        })
        wx.request({
            method: 'GET',
            url: 'http://server/database/ArticleCom/?ArticleCom.aid=' + that.data.aid,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res)
                if (res.data.data.length != 0) {
                    wx.showModal({
                        title: '注意！',
                        content: '已经有编辑驳回该文过了，是否提供更多修改意见？',
                        success(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                                wx.navigateTo({
                                    url: '/pages/notPass/notPass?type=1&openid=' + ui.openid + "&aid=" + that.data.aid,
                                })
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                } else {
                    wx.navigateTo({
                        url: '/pages/notPass/notPass?type=1&openid=' + ui.openid + "&aid=" + that.data.aid,
                    })
                }
            },
            fail(res) {
                console.log(res)
            }
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
    onShow() {

    },

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

    },
    updatePosition(keyboardHeight) {
        const toolbarHeight = 50
        const {
            windowHeight,
            platform
        } = wx.getSystemInfoSync()
        let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
        this.setData({
            editorHeight,
            keyboardHeight
        })
    },
    calNavigationBarAndStatusBar() {
        const systemInfo = wx.getSystemInfoSync()
        const {
            statusBarHeight,
            platform
        } = systemInfo
        const isIOS = platform === 'ios'
        const navigationBarHeight = isIOS ? 44 : 48
        return statusBarHeight + navigationBarHeight
    },
    onEditorReady() {
        const that = this
        wx.createSelectorQuery().select('#editor').context(function (res) {
            that.editorCtx = res.context
        }).exec()
    },
    blur() {
        this.editorCtx.blur()
    },
    format(e) {
        let {
            name,
            value
        } = e.target.dataset
        if (!name) return
        // console.log('format', name, value)
        this.editorCtx.format(name, value)

    },
    onStatusChange(e) {
        const formats = e.detail
        this.setData({
            formats
        })
    },
    insertDivider() {
        this.editorCtx.insertDivider({
            success: function () {
                console.log('insert divider success')
            }
        })
    },
    clear() {
        this.editorCtx.clear({
            success: function (res) {
                console.log("clear success")
            }
        })
    },
    removeFormat() {
        this.editorCtx.removeFormat()
    },
    insertDate() {
        const date = new Date()
        const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        this.editorCtx.insertText({
            text: formatDate
        })
    },
})