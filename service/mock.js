var data = {
  // 主题
  themes: [{ id: 0, name: '推荐', icon: 'icon', index: 0 }, { id: 1, name: '攻略', icon: 'icon', index: 0 }, { id: 2, name: '旅游记录', icon: 'icon', index: 1 }, { id: 4, name: '心得体会', icon: 'clothesfill', index: 2 }, { id: 5, name: '精选美文', icon: 'clothesfill', index: 2 }],
}

function getData(pageNo, type) {
  var result = {};
  result.themes = data.themes;
  var itemType = type||data.themes[0].id;
  var contents = [];
  if (itemType == 0) {
    contents = data.items.filter(item => item.isRecommend == 1);
  } else {
    contents = data.items.filter(item => item.themeId == itemType);
  }
  var offset = (pageNo - 1) * 6;
  result.items = (offset + 6 >= contents.length) ? contents.slice(offset, contents.length) : contents.slice(offset, offset + 6);
  return result;
}

function getItemById(id) {
  var itemObject = {};
  data.items.forEach(function (item, index, array) {
    if (item.id == id) {
      itemObject = item;
    }
  })
  return itemObject;
}

module.exports = {
  getData: getData,
  getItemById: getItemById
}
