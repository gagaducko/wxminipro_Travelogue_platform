// pages/more/more.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userinfo: {},
      openid: "",
      imageUrl: "/image/backview/background.png",
      nickName: "默认昵称",
      // 列表信息
      newsList: [],
      // 审核中的列表
      newsList_shenhe: []
  },

  turnEditor() {
    wx.navigateTo({
      url: '/pages/editor/editor',
    })
},

// 获取待审核的部分文档
getContextShenhe() {
  const that = this;
  wx.request({
    method: "GET",
    url: 'http://server/database/article/?article.openid=' + this.data.openid + '&article.stat=1',
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

// 获取草稿箱里面的信息
getContextNormal() {
  const that = this;
  wx.request({
    method: "GET",
    url: 'http://server/database/article/?article.openid=' + this.data.openid + '&article.stat=0',
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
        newsList: newsList
      })
    },
    fail (res) {
      console.log("now is fail", res.data)
    }
  })
},

getUserInfo: function(e) {
  // 推荐使用 wx.getUserProfile 获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
  // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  const that = this;
  console.log("now is get user info")
      wx.getUserInfo({
        desc: '用于正常使用游记相关功能', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log("userinfo:" + res)
          that.setData({
            userinfo: res.userInfo,
            nickName: res.userInfo.nickName,
            imageUrl: res.userInfo.avatarUrl,
            isUserOk: true
          })
          wx.showToast({
            title: "登录请求中……"
          })
          if(that.data.isUserOk == true) {
            console.log("it is true")
            wx.login({
              success(res) {
              if (res.code) {
                console.log("data is :" + res.code)
                // 发起网络请求
                wx.request({
                url: 'https://gamepro.liangleya.icu/auth/wxlogin',
                data: {
                  code: res.code
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                method: "POST",
                  success(res) {
                  console.log("登录成功！" + res.data.openid)
                  that.setData({
                    openid: res.data.openid
                  })
                  that.data.userinfo.openid = res.data.openid
                  var openidPost = res.data.openid
                  //看看user的情况
                  wx.request({
                    method: "GET",
                    url: "http://server/database/user/?user.openid=" + openidPost,
                    data: {
                    },
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success (res) {
                      console.log("以下是rmp的消息",res)
                      console.log(res.data.data)
                      //若是没有信息的，那么就作为新用户
                      if(res.data.data.length == 0) {
                        console.log("need add new user")
                        wx.request({
                          method: 'POST',
                          url: "http://server/database/user/",
                          data: {
                            "openid": openidPost,
                            "nickname": nickNameDefault,
                            "avatarUrl": avatarUrlDefault,
                            "fanNum": 0,
                            "gender": 0,
                            "role": 0
                          },
                          header: {
                            'content-type': 'application/json' // 默认值
                          },
                          success (res) {
                            console.log("以下是向rmp中增加内容后的消息",res)
                            var userinfoStor = {};
                            userinfoStor.avatarUrl = res.data.data.avatarUrl;
                            userinfoStor.openid = res.data.data.openid;
                            userinfoStor.fanNum = res.data.data.fanNum;
                            userinfoStor.nickName = res.data.data.nickname;
                            userinfoStor.role = res.data.data.role;
                            userinfoStor.gender = res.data.data.gender;
                            userinfoStor.id = res.data.data.id;
                            console.log("userinfoStor is:", userinfoStor)
                            wx.setStorageSync("userinfo", userinfoStor)
                            that.setData({
                              userinfo: userinfoStor,
                              nickName: userinfoStor.nickName,
                              imageUrl: userinfoStor.avatarUrl,
                              forksCount: userinfoStor.fanNum,
                              isUserOk: true
                            })
                          }
                        })
                      } else {
                        var userinfoStor = {};
                        userinfoStor.avatarUrl = res.data.data[0].avatarUrl;
                        userinfoStor.openid = res.data.data[0].openid;
                        userinfoStor.fanNum = res.data.data[0].fanNum;
                        userinfoStor.nickName = res.data.data[0].nickname;
                        userinfoStor.role = res.data.data[0].role;
                        userinfoStor.gender = res.data.data[0].gender;
                        userinfoStor.id = res.data.data[0].id;
                        userinfoStor.isUserOk = true;
                        console.log("userinfoStor is:", userinfoStor)
                        console.log("userinfoStor is:", userinfoStor)
                        wx.setStorageSync("userinfo", userinfoStor)
                        that.setData({
                          userinfo: userinfoStor,
                          nickName: userinfoStor.nickName,
                          imageUrl: userinfoStor.avatarUrl,
                          forksCount: userinfoStor.fanNum,
                          isUserOk: true
                        })
                      }
                    },
                    fail (res) {
                      console.log("没有找到对应的内容", res)
                    }
                  })
                  },
                  fail(res) {
                    that.setData({
                      userinfo: {}
                    })
                    console.log('登录失败！' + res)
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        }
        console.log(this.data.userinfo)
        return 1;
      },
      fail: (res)=> {
        wx.showToast({
          title: '登录失败',
        })
        console.log("fail to login")
        return 0;
      }
  })
},

/**
* 生命周期函数--监听页面加载
*/
onLoad(options) {
  const that = this;
  const ui = wx.getStorageSync('userinfo')
  this.setData({
    userinfo: ui,
    openid: ui.openid,
    nickName: ui.nickName,
    imageUrl: ui.avatarUrl,
    forksCount: ui.fanNum,
  }, () => {
    that.getContextNormal();
    that.getContextShenhe();
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
  onShow(options) {
      this.onLoad();
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