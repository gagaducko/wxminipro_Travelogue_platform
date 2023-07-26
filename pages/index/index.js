// index.js
// 获取应用实例
const app = getApp()

var themes = [{ id: 0, name: '推荐', icon: 'icon', index: 0 }, { id: 1, name: '攻略', icon: 'icon', index: 0 }, { id: 2, name: '旅游记录', icon: 'icon', index: 1 }, { id: 4, name: '心得体会', icon: 'clothesfill', index: 2 }, { id: 5, name: '精选美文', icon: 'clothesfill', index: 2 }]
var items = [];
Page({
  data: {
    contentHeight: app.globalData.windowHeight,
    TabCur: null,
    themes: [],
    items: [],
    pigeSize: 6,
    pageNum: 1,
  },

  getInfoAll() {
    const that =this;
    wx.request({
      method: 'GET',
      url: 'http://server/database/article/?article.stat=2',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("suc:", res.data.data)
        for (var i = 0; i < res.data.data.length; i++) {
          var isRecommend = "1"
          var tmp = {
            frontImage: {
              url: res.data.data[i].coverImg,
              width: '640',
              height: '640'
            },
            "themeIcon": "camerafill",
            "publishDate": res.data.data[i].date,
            "themeId": res.data.data[i].mainType + 1,
            "isRecommend": isRecommend,
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
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    console.log("now is onLoad")
    this.getInfoAll();
    console.log("onLoad ok")
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

  // tab选择事件
  tabSelect(e) {
    var id = e.currentTarget.dataset.id;
    var data = this.getData(1, id);
    this.setData({
      TabCur: id,
      items: data.items,
      pageNum: 1
    })

    this._doRefreshMasonry([])
    this._doRefreshMasonry(this.data.items);
  }
})