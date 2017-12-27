// pages/fm/fm.js
var updateFood = function (that) {
  var dish = that.data.board;
  var foodlist = wx.getStorageSync('likedFood');
  var ifSame = false;
  for (var i in foodlist) {
    if (foodlist[i].name === dish.name) {
      ifSame = true;
      foodlist.splice(i,1);
    }
  }
  if (ifSame === false) {
    foodlist.push(dish);
  }
  wx.setStorageSync('likedFood', foodlist);
  var dishes = [];
  for (var i in foodlist) {
    dishes.push(foodlist[i].name);
  }
  wx.request({
    url: 'https://www.ustb.wang/updateUserFood',
    data: {
      id: wx.getStorageSync('userId'),
      dishes: dishes
    },
    method: 'POST',
    success: function (res) {
      console.log(res.data)
    }
  })
}

Page({
  onShareAppMessage: function () {
    var that = this;
    var url = '/pages/detail/detail?name=' + that.data.board.name
      + '&place=' + that.data.board.place
      + '&area=' + that.data.board.area
      + '&price=' + that.data.board.price
      + '&popular=' + that.data.board.rate.popular
      + '&chilli=' + that.data.board.rate.chilli
      + '&time=' + that.data.board.rate.time
      + '&seat=' + that.data.board.rate.seat
      + '&pic=' + that.data.board.pic
      + '&ifShare=true'
    return {
      title: that.data.board.name + ' ' + that.data.board.place + that.data.board.area + that.data.board.price,
      path: url,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  data: {
    picurl: 'http://pic.ustb.wang/image/',
    imgurl: '/images/block/block',
    likeStyle: 'like',
    description: {
      popular: ['小众', '少见', '常见', '热门', '火爆'],
      chilli: ['不辣', '微辣', '中辣', '超辣', '极辣'],
      time: ['很快', '约2分钟', '约5分钟', '约10分钟', '10分钟以上'],
      seat: ['空闲', '很多', '少量', '紧张', '无座']
    },
    board: {
      name: '',
      place: '',
      area: '',
      price: '',
      rate: {
        popular: 0,
        chilli: 0,
        time: 0,
        seat: 0
      },
      pic: '_block.jpg'
    }
  },
  onLoad: function (options) {
    this.setData({
      'board.name': options.name,
      'board.place': options.place,
      'board.area': options.area,
      'board.price': options.price,
      'board.rate.popular': options.popular,
      'board.rate.chilli': options.chilli,
      'board.rate.time': options.time,
      'board.rate.seat': options.seat,
      'board.pic': options.pic,
      'likeStyle': options.likeStyle,
      'ifShare': options.ifShare
    })
  },
  //回到首页
  toIndex: function (){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  //收藏或取消
  likeIt: function() {
    if(this.data.likeStyle == 'like') {
      this.setData({
        likeStyle: 'liked'
      })
      updateFood(this);
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        duration: 800
      })
    } else {
      this.setData({
        likeStyle: 'like'
      })
      updateFood(this);
      wx.showToast({
        title: '取消收藏成功',
        icon: 'success',
        duration: 800
      })
    }
  }
})