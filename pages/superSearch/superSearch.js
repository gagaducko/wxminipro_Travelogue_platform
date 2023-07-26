// pages/superSearch/superSearch.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        search: "",
        year: "",
        author: "",
        type1: "",
        mainType: 3,
        typeArray: ["攻略", "旅游记录", "心得体会", "不限"],
        type2: ""
    },

    turnSearch() {
        var str = ""
        if(this.data.year != "") {
            str = str + "&year=" + this.data.year
        }
        if(this.data.author != "") {
            str = str + "&author=" + this.data.author
        }
        if(this.data.type1 != "") {
            str = str + "&type1=" + this.data.type1
        }
        if(this.data.mainType != 3) {
            str = str + "&mainType=" + this.data.mainType
        }
        if(this.data.type2 != "") {
            str = str + "&type2=" + this.data.type2
        }
        var urlIt = '/pages/searchRes/searchRes?type=1&search=' + this.data.search + str
        console.log(urlIt)
        wx.navigateTo({
            url: urlIt
        })
    },

    getInputValueTitle(e) {
        console.log(e.detail)
        this.setData({
            title: e.detail.value
        })
    },

    getInputValueAuthor(e) {
        console.log(e.detail)
        this.setData({
            author: e.detail.value
        })
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
            case "3":
                this.setData({
                    mainType: 3
                })
                break;
            default:
                console.log("wrong here")
                break;
        }
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

    getInputValue(e) {
        console.log(e.detail)
        this.setData({
            search: e.detail.value
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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