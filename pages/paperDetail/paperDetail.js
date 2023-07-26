// pages/paperDetail/paperDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverImg: "https://tse3-mm.cn.bing.net/th/id/OIP-C.oW9B-_TdQHMoiKbi2tM6RAHaCM?pid=ImgDet&rs=1",
        title: "nihao",
        readOnly: true,
        date: "2023/5/21",
        isStar: "未收藏",
        userinfo: {},
        articleInfo: {},
        id: 0,
        author: {
            avatarUrl: '',
            nickName: 'pipiXia',
        },
        content: "",
        isFocus:'关注',
        commandList: [
            {
                nickName: "pikachu",
                avatarUrl:'https://img.zcool.cn/community/019bca578c700f0000018c1b8f140c.jpg@1280w_1l_2o_100sh.jpg',
                content: 'pikapi'
            }
        ]
    },

    next() {
        if(this.data.isStar == "未收藏") {
            this.setData({
                isStar: '已收藏'
            })
        } else {
            this.setData({
                isStar: '未收藏'
            })
        }
    },

    confirm() {
        var tmp ={
            nickName: this.data.userinfo.nickName,
            avatarUrl: this.data.userinfo.avatarUrl,
            content: 'nihao'
        }
        var data = this.data.commandList;
        data.push(tmp)
        this.setData({
            commandList: data
        })
    },


    getAllInfo(id) {
        const that = this;
        wx.request({
            method: 'GET',
            url: 'http://server/database/ArticleDetail/?ArticleDetail.OAOD.id=' + id,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.data.data[0])
                that.setData({
                    content: res.data.data[0].content,
                    articleInfo: res.data.data[0].OAOD,
                    coverImg: res.data.data[0].OAOD.coverImg,
                    title: res.data.data[0].OAOD.title,
                    date: res.data.data[0].OAOD.date
                },() => {
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
                wx.request({
                    method: 'GET',
                    url: 'http://server/database/user/?user.openid=' + res.data.data[0].OAOD.openid,
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success(res) {
                        console.log(res.data.data[0])
                        var author = {
                            avatarUrl: res.data.data[0].avatarUrl,
                            nickName: res.data.data[0].nickname,
                        }
                        that.setData({
                            author: author
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

    focus() {
        if(this.data.isFocus == '关注'){
            this.setData({
                isFocus: '已关注'
            })
        } else {
            this.setData({
                isFocus: '关注'
            })
        }
    },
        /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options)
        var ui = wx.getStorageSync('userinfo')
        console.log("ui is:",ui)
        if (!ui) {
            console.log("wrong to get")
            wx.showModal({
                title:'抱歉',
                content:'请登陆后查看',
                showCancel:false, //默认为true,false去掉取消按钮
                confirmText:'去登陆',//默认是“确认”
                confirmColor:'',//确认文字的颜色
                success:function(res)
                {
                    if(res.cancel)
                    {
                        //点击取消按钮
                    }else if(res.confirm)
                    {
                        //点击确认按钮
                        wx.switchTab({
                          url: '/pages/myInfo/myInfo',
                        })
                    }
                }
            })
        }
        this.setData({
            userinfo: ui,
            id: options.id
        })
        this.getAllInfo(options.id);
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