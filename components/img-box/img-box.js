Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  properties: {
    item: {
      type: Object
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: "",
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toDetials(e) {
      var id = e.currentTarget.dataset.id;
      var url = '/pages/paperDetail/paperDetail'+"?id="+id
      console.log(url);
      wx.navigateTo({
        url: url
      })
    }
  }
})