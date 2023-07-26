// pages/myEditor/myEditor.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ui: {},
        case: 0,
        assessNum: 0,
        // 审核中的列表
        newsList_shenhe: []
    },

    // 获取待审核的部分文档
getContextShenhe_xiaobian() {
    const that = this;
    wx.request({
      method: "GET",
      url: 'http://server/database/article/?article.stat=1',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log("now is success", res.data)
        var newsList = [];
        for(var i = 0; i < res.data.data.length; i++) {
          var newsItem = {
            id: res.data.data[i].id,
            title: res.data.data[i].title,
            summary: res.data.data[i].summary,
            coverImg: res.data.data[i].coverImg,
            date: res.data.data[i].date,
          }
          newsList.push(newsItem);
        }
        that.setData({
          newsList_shenhe: newsList
        })
      },
      fail (res) {
        console.log("now is fail", res.data)
      }
    })
  },
  getContextShenhe_zhubian() {
    const that = this;
    wx.request({
      method: "GET",
      url: 'http://server/database/article/?article.stat=3',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log("now is success", res.data)
        var newsList = [];
        for(var i = 0; i < res.data.data.length; i++) {
          var newsItem = {
            id: res.data.data[i].id,
            title: res.data.data[i].title,
            summary: res.data.data[i].summary,
            coverImg: res.data.data[i].coverImg,
            date: res.data.data[i].date,
          }
          newsList.push(newsItem);
        }
        that.setData({
          newsList_shenhe: newsList
        })
      },
      fail (res) {
        console.log("now is fail", res.data)
      }
    })
  },
    wantToBe() {
        const that = this
        wx.request({
            method: 'POST',
            url: 'http://server/database/editor',
            data: {
                openid: this.data.ui.openid,
                assessNum: 0,
                isOk: 1
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log("suc:", res)
                that.setData({
                    case: 1
                })
            },
            fail(res) {
                console.log("fail:", res)
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const that= this;
        var ui = wx.getStorageSync('userinfo')
        this.setData({
            ui: ui
        })
        console.log("ui:", ui)
        wx.request({
            method: 'GET',
            url: 'http://server/database/editor/?editor.openid=' + ui.openid,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log("suc:", res)
                if (res.data.data.length == 0) {
                    console.log("没有东西呢")
                } else {
                    var caseId = res.data.data[0].isOk + 1
                    var assessNum = res.data.data[0].assessNum
                    console.log("caseId", caseId)
                    that.setData({
                        case: caseId,
                        assessNum: assessNum
                    }, () => {
                        if(that.data.case == 2) {
                            that.getContextShenhe_xiaobian();
                        }
                        if(that.data.case == 3) {
                            that.getContextShenhe_zhubian();
                        }
                    })
                }
            },
            fail(res) {
                console.log("fail:", res)
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

    }
})