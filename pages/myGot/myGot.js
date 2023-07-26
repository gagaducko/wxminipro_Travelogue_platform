// pages/myGot/myGot.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        allPaper: 8,
        allView: 12,
        allStar: 6,
        fanNum: 0,
        place: 3,
        city: 5
    },

    get2() {
        wx.showModal({
            title: '恭喜',
            content: '截至目前，您一共发布了' + this.data.fanNum + '个粉丝的关注',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    console.log('确定')
                } else {
                    console.log('取消')
                }
            }
        })
    },

    get1() {
        wx.showModal({
            title: '恭喜',
            content: '截至目前，您一共收获了' + this.data.allPaper + '篇文章\n收获了'
            + this.data.allStar + '个搜藏\n并一共得到了'
            + this.data.allPaper + '次点击观看\n',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    console.log('确定')
                } else {
                    console.log('取消')
                }
            }
        })
    },

    get3() {
        wx.showModal({
            title: '恭喜',
            content: '截至目前，您的足迹遍布了中国' + this.data.place + '个省份' + this.data.city + '个城市',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    console.log('确定')
                } else {
                    console.log('取消')
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options)
        var ui = wx.getStorageSync('userinfo')
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