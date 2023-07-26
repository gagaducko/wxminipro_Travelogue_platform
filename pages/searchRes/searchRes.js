// pages/searchRes/searchRes.js
const app = getApp()
var items = [];
var themes = [{ id: 0, name: '推荐', icon: 'icon', index: 0 }, { id: 1, name: '攻略', icon: 'icon', index: 0 }, { id: 2, name: '旅游记录', icon: 'icon', index: 1 }, { id: 4, name: '心得体会', icon: 'clothesfill', index: 2 }, { id: 5, name: '精选美文', icon: 'clothesfill', index: 2 }]
Page({

    /**
     * 页面的初始数据
     */
    data: {
        contentHeight: app.globalData.windowHeight,
        TabCur: null,
        items: [],
        pigeSize: 6,
        pageNum: 1,
    },

    getSearchInfoAll(options) {
        var str = "";
        if(options.search) {
            str = str + "&article.title=(like)" + options.search
        }
        if(options.mainType) {
            str = str + "&article.mainType" + options.mainType
        }
        if(options.type1) {
            str = str + "&article.type1=(like)" + options.type1
        }
        if(options.type1) {
            str = str + "&article.type2=(like)" + options.type2
        }
        if(options.year) {
            str = str + "&article.date=(like)" + options.year
        }
        if(options.author) {
            str = str + "&article.user.nickname=(like)" + options.author
        }
        var urlIt ="http://server/database/article/?article.stat=2" + str
        console.log(urlIt)
        const that = this;
        wx.request({
            method: 'GET',
            url: urlIt,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log("suc:", res.data.data)
                for (var i = 0; i < res.data.data.length; i++) {
                    var tmp = {
                        frontImage: {
                            url: res.data.data[i].coverImg,
                            width: '640',
                            height: '640'
                        },
                        "themeIcon": "camerafill",
                        "publishDate": res.data.data[i].date,
                        "themeId": "0",
                        "isRecommend": "1",
                        "id": res.data.data[i].id,
                        "title": res.data.data[i].title,
                        "likeNum": res.data.data[i].viewNum,
                        "tags": [res.data.data[i].type1, res.data.data[i].type2]
                    }
                    items.push(tmp);
                }
                console.log("now it is over", )
                var i = that.getData(that.data.pageNum);
                that.setData({
                    TabCur: themes[0].id,
                    themes: themes,
                    items: i.items
                });
                that._doRefreshMasonry(that.data.items)
            },
            fail(res) {
                console.log("fail:", res)
            }
        })
    },

    getSearchInfoMy() {
        var ui = wx.getStorageSync('userinfo')
        var urlIt ="http://server/database/article/?article.stat=2&article.openid="+ui.openid
        console.log(urlIt)
        const that = this;
        wx.request({
            method: 'GET',
            url: urlIt,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log("suc:", res.data.data)
                for (var i = 0; i < res.data.data.length; i++) {
                    var tmp = {
                        frontImage: {
                            url: res.data.data[i].coverImg,
                            width: '640',
                            height: '640'
                        },
                        "themeIcon": "camerafill",
                        "publishDate": res.data.data[i].date,
                        "themeId": "0",
                        "isRecommend": "1",
                        "id": res.data.data[i].id,
                        "title": res.data.data[i].title,
                        "likeNum": res.data.data[i].viewNum,
                        "tags": [res.data.data[i].type1, res.data.data[i].type2]
                    }
                    items.push(tmp);
                }
                console.log("now it is over", )
                var i = that.getData(that.data.pageNum);
                that.setData({
                    TabCur: themes[0].id,
                    themes: themes,
                    items: i.items
                });
                that._doRefreshMasonry(that.data.items)
            },
            fail(res) {
                console.log("fail:", res)
            }
        })
    },

    getSearchInfoStar() {
        var ui = wx.getStorageSync('userinfo')
        var urlIt ="http://server/database/ArticleStar/?ArticleStar.openid="+ui.openid
        console.log(urlIt)
        const that = this;
        wx.request({
            method: 'GET',
            url: urlIt,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log("suc:", res.data.data)
                for (var i = 0; i < res.data.data.length; i++) {
                    var aid = res.data.data[i].aid
                    wx.request({
                        method: 'GET',
                        url: 'http://server/database/article/' + aid,
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success(res) {
                            var tmp = {
                                frontImage: {
                                    url: res.data.data.coverImg,
                                    width: '640',
                                    height: '640'
                                },
                                "themeIcon": "camerafill",
                                "publishDate": res.data.data[i].date,
                                "themeId": "0",
                                "isRecommend": "1",
                                "id": res.data.data[i].id,
                                "title": res.data.data[i].title,
                                "likeNum": res.data.data[i].viewNum,
                                "tags": [res.data.data.type1, res.data.data.type2]
                            }
                            items.push(tmp);
                        },
                        fail(res) {
                            
                        }
                    })
                }
                console.log("now it is over", )
                var i = that.getData(that.data.pageNum);
                that.setData({
                    TabCur: themes[0].id,
                    themes: themes,
                    items: i.items
                });
                that._doRefreshMasonry(that.data.items)
            },
            fail(res) {
                console.log("fail:", res)
            }
        })
    },

    getData(pageNo, type) {
        var result = {};
        // 先找一下这个type
        var itemType = type || themes[0].id;
        var contents = [];
        if (itemType == 0) {
            contents = items.filter(item => item.isRecommend == 1);
        } else {
            contents = items.filter(item => item.themeId == itemType);
        }
        var offset = (pageNo - 1) * 6;
        result.items = (offset + 6 >= contents.length) ? contents.slice(offset, contents.length) : contents.slice(offset, offset + 6);
        return result;
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options)
        console.log(options.search)
        console.log(options.type1)
        console.log(options.type2)
        console.log(options.author)
        console.log(options.year)
        console.log(options.mainType)
        if(options.type == 1) {
            this.getSearchInfoAll(options)
        }
        if(options.type == 999) {
            console.log("now is 999")
            this.getSearchInfoMy();
        }
        if(options.type == 888) {
            console.log("now is 888")
            this.getSearchInfoStar();
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

    // 拉触底加载
    onReachBottom: function () {
        var pageNo = this.data.pageNum + 1;
        var data = this.getData(pageNo, this.data.TabCur);
        if (data.items && data.items.length > 0) {
            this.setData({
                pageNum: pageNo
            })
            this._doAppendMasonry(data.items)
        }
    },

    // 刷新数据
    _doRefreshMasonry(items) {
        this.masonryListComponent = this.selectComponent('#masonry');
        if (this.masonryListComponent) {
            this.masonryListComponent.start(items).then(() => {
                //console.log('刷新 completed')
            })
        }
    },

    // 追加数据
    _doAppendMasonry(items) {
        this.masonryListComponent = this.selectComponent('#masonry')
        this.masonryListComponent.append(items).then(() => {
            //console.log('追加 completed')
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})