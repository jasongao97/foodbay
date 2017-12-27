//foods.js
//获取应用实例
var app = getApp()

var getFood = function (that, userId, userInfo) {
  wx.showNavigationBarLoading()
  wx.request({
    url: 'https://www.ustb.wang/getUserFood',
    data: {
      id: userId,
      info: userInfo
    },
    method: 'POST',
    success: function (res) {
      if (!res.data) {
        wx.showModal({
          title: '提示',
          content: '服务器提出了一个问题 请刷新重试',
          showCancel: false
        })
      } else {
        wx.setStorageSync('likedFood', res.data.food);
        that.setData({
          food: wx.getStorageSync('likedFood')
        })
      }
    },
    complete: function () {
      wx.hideNavigationBarLoading()
    }
  })
}

Page({
  data: {
    imgurl: '/images/block/block',
    description: {
      popular: ['小众', '少见', '常见', '热门', '火爆'],
      chilli: ['不辣', '微辣', '中辣', '超辣', '极辣'],
      time: ['很快', '约2分钟', '约5分钟', '约10分钟', '10分钟以上'],
      seat: ['空闲', '很多', '少量', '紧张', '无座']
    }
  },
  toFM: function () {
    wx.navigateTo({
      url: '/pages/fm/fm'
    })
  },
  toSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  onLoad: function () {
    var userId = wx.getStorageSync('userId');
    var userInfo = wx.getStorageSync('userInfo');
    getFood(this, userId, userInfo);
  },
  onShow: function () {
    this.setData({
      food: wx.getStorageSync('likedFood')
    })
  },
  onPullDownRefresh: function () {
    var userId = wx.getStorageSync('userId');
    var userInfo = wx.getStorageSync('userInfo');
    getFood(this, userId, userInfo);
    wx.stopPullDownRefresh();
  },
  toDetail: function (event) {
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
