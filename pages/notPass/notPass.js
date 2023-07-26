// pages/notPass/notPass.js
var util = require("../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        answer: "",
        type: 0,
        openid: "",
        aid: 0,
        haveCom: false,
        ui: {},
        recomList: []
    },

    //实时回调
    getInput: function (options) {
        //获取输入框输入的内容
        let value = options.detail.value;
        this.setData({
            answer: value
        }, () => {
            console.log("输入框输入的内容是 " + value)
        })
    },

    updateIt() {
        const that = this;
        var datatime = util.formatTime(new Date());
        wx.request({
            method: 'POST',
            url: 'http://server/database/ArticleCom',
            data: {
                date: datatime,
                content: that.data.answer,
                openid: that.data.openid,
                aid: that.data.aid
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res)
            },
            fail(res) {
                console.log(res)
            }
        },() => {
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
                            "value": "this is test 2"
                        },
                        "name4": {
                            "value": "nihao"
                        },
                        "thing2": {
                            "value": "not good"
                        } ,
                        "thing3": {
                            "value": "审核驳回"
                        },
                        "date6": {
                            "value": "2023/5/21"
                        }
                    }
                  }
            })
        })
        wx.navigateBack({
            delta: 2,
        })
    },

    backView() {
        wx.navigateBack({
            delta: 0,
        })
    },

    getRecom() {
        const that = this;
        wx.request({
            method: 'GET',
            url: 'http://server/database/ArticleCom/?ArticleCom.aid=' + this.data.aid,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res)
                if (res.data.data.length == 0) {
                    console.log("no")
                } else {
                    that.setData({
                        recomList: res.data.data,
                        haveCom: true
                    })
                }
            },
            fail(res) {

            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const that = this;
        var ui = wx.getStorageSync('userinfo')
        console.log(options)
        if (options.type == 1) {
            this.setData({
                aid: parseInt(options.aid),
                type: options.type,
                openid: options.openid,
                ui: ui
            })
        } else if (options.type == 2) {
            this.setData({
                aid: parseInt(options.aid),
                type: options.type
            }, () => {
                that.getRecom();
            })
        }
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