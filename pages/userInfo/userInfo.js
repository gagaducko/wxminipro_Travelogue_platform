// pages/userInfo/userInfo.js
let defaultAvatarUrl = ""
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userinfo: {},
        openid: "",
        theme: wx.getSystemInfoSync().theme,
        avatarUrl: "",
        nickname: ""
    },

    getInputValue(e) {
      console.log(e.detail)
      this.setData({
        nickname: e.detail.value
      })
    },

    onChooseAvatar(e) {
      const { avatarUrl } = e.detail 
      this.setData({
        avatarUrl: avatarUrl
      })
    },

    changeUi(e) {
      let userinfo_tmp = this.data.userinfo
      console.log(userinfo_tmp)
      if(this.data.avatarUrl == "") {
        wx.showToast({
          title: '头像不能为空',
        })
        return;
      }
      if(this.data.nickname == "") {
        wx.showToast({
          title: '昵称不能为空',
        })
        return;
      }
      userinfo_tmp.nickName = this.data.nickname
      userinfo_tmp.avatarUrl = this.data.avatarUrl
      wx.setStorageSync('userinfo', userinfo_tmp)
      wx.switchTab({
        url: '/pages/myInfo/myInfo',
      })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      const ui = wx.getStorageSync('userinfo')
      defaultAvatarUrl = ui.avatarUrl
      this.setData({
        userinfo: ui,
        openid: ui.openid,
        avatarUrl: defaultAvatarUrl
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
        const ui = wx.getStorageSync('userinfo')
        defaultAvatarUrl = ui.avatarUrl
        this.setData({
          userinfo: ui,
          openid: ui.openid,
          avatarUrl: defaultAvatarUrl
        })
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