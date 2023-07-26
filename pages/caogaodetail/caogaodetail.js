// pages/caogaodetail/caogaodetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        aid: 0,
        adid: 0,
        formats: {},
        userinfo: {},
        readOnly: false,
        placeholder: '开始输入...',
        editorHeight: 300,
        keyboardHeight: 0,
        isIOS: false
    },


    readOnlyChange() {
        this.setData({
            readOnly: !this.data.readOnly
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
    //获取编辑器输入的内容
    getContent() {
        const that = this;
        this.editorCtx.getContents({
            success: function (res) {
                console.log("success here")
                console.log(res)
                console.log(res.delta.ops)
                console.log("content is;", res.delta)
                var content = JSON.stringify(res.delta);
                wx.setStorageSync('contentTmp', content)
                console.log("new content is:", content);
                wx.navigateTo({
                    url: '/pages/savePost/savePost?type=3' + '&aid=' + that.data.aid + '&adid=' + that.data.adid
                })
            },
            fail: function (error) {
                console.log("error here")
                console.log(error)
            }
        })
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

    getContentDetail(id) {
        const that = this
        wx.request({
            method: "GET",
            url: 'http://server/database/ArticleDetail/?ArticleDetail.OAOD.id=' + id,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log("now is success res", res.data.data[0])
                that.setData({
                    aid: res.data.data[0].OAOD.id,
                    adid: res.data.data[0].id
                })
                var content = JSON.parse(res.data.data[0].content)
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
            },
            fail(res) {
                console.log("now is fail", res.data.DATA[0])
            }
        })
    },
    onLoad(options) {
        const that= this;
        console.log(options);
        this.getContentDetail(options.id)
        const platform = wx.getSystemInfoSync().platform
        const isIOS = platform === 'ios'
        const ui = wx.getStorageSync('userinfo')
        this.setData({
            userinfo: ui
        })
        this.setData({
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

    }
})