// pages/search/search.js
function search(value, that) {
  wx.request({
    url: 'https://www.ustb.wang/searchFood?name=' + value,
    method: 'GET',
    success: function (res) {
      if (!res.data) {
        wx.showModal({
          title: '提示',
          content: '小程序提出了一个问题 请刷新重试',
          showCancel: false
        })
      } else {
        that.setData({
          food: res.data.food,
        })
      }
    },
  })
}

Page({
  data: {
    input: '',
    recenttag: [],
    hottag: [],
    imgurl: '/images/block/block',
    description: {
      popular: ['小众', '少见', '常见', '热门', '火爆'],
      chilli: ['不辣', '微辣', '中辣', '超辣', '极辣'],
      time: ['很快', '约2分钟', '约5分钟', '约10分钟', '10分钟以上'],
      seat: ['空闲', '很多', '少量', '紧张', '无座']
    }
  },
  onLoad: function (options) {
    var that = this;
    var recentSearch = wx.getStorageSync('recentSearch');
    wx.request({
      url: 'https://www.ustb.wang/getHotTag',
      method: 'GET',
      success: function (res) {
        that.setData({
          hottag: res.data.hottag,
        })
      }
    })
    this.setData({
      recenttag: recentSearch
    })
  },
  //取消
  toCancel: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  //点击tag时候执行
  handletag: function (event) {
    this.setData({
      input: event.currentTarget.id
    })
    search(event.currentTarget.id, this);
  },
  //每次输入的时候都会搜索
  handleInput: function (event) {
    search(event.detail.value, this);
  },
  //删除最近历史记录
  clearRecent: function () {
    wx.removeStorage({
      key: 'recentSearch'
    })
    this.setData({
      recenttag: []
    })
  },
  //点击进入详情页面
  toDetail: function (event) {
    //保存为最近搜索
    var recentSearch = wx.getStorageSync('recentSearch');
    var newRecent = this.data.food[event.currentTarget.id].name
    if (recentSearch) {
      for (i in recentSearch) {
        if (recentSearch[i] === newRecent) recentSearch.splice(i, 1);
      }
      if (recentSearch.length >= 3) recentSearch.shift();
      recentSearch.push(newRecent);
    } else {
      recentSearch = [newRecent]
    }
    wx.setStorage({
      key: 'recentSearch',
      data: recentSearch,
    })
    //处理详情页面数据
    var food = this.data.food[event.currentTarget.id];
    var foodlist = wx.getStorageSync('likedFood');
    var likeStyle = 'like';
    for (var i in foodlist) {
      if (foodlist[i].name === food.name) {
        likeStyle = 'liked'
        break;
      }
    }
    wx.navigateTo({
      url: '/pages/detail/detail?name=' + food.name
      + '&place=' + food.place
      + '&area=' + food.area
      + '&price=' + food.price
      + '&popular=' + food.rate.popular
      + '&chilli=' + food.rate.chilli
      + '&time=' + food.rate.time
      + '&seat=' + food.rate.seat
      + '&pic=' + food.pic
      + '&likeStyle=' + likeStyle
    })
  }
})