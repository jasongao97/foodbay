// pages/fm/fm.js
var util = require('../../utils/util.js')

var getFoodFromFM = function (that) {
  wx.request({
    url: 'https://www.ustb.wang/getFoodFromFM',
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
        wx.setStorage({
          key: 'FMFood',
          data: res.data.food
        })
      }
    },
  })
}

Page({
  data: {
    onResult: true,
    ifLoading: false,
    timeleft: '30',
    picurl: 'http://pic.ustb.wang/image/',
    food: [{pic: '_block.jpg' }, { pic: '_block.jpg' }, { pic: '_block.jpg' }, { pic: '_block.jpg' }]
  },
  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'FMFood',
      success: function(res) {
        that.setData({
          food: res.data
        })
      },
    })
    var timestamp = Date.parse(new Date());
    //格式化后的时间
    this.setData({
      date: util.formatTime(new Date())
    })
    //倒计时用时间
    timestamp = timestamp / 1000;
    var time = timestamp - wx.getStorageSync('date');
    console.log(time);
    //距离上一次生成的时间（秒）
    if (time >= 1800) {
      getFoodFromFM(this);
      this.setData({
        onResult: false
      });
    } else {
      this.setData({
        timeleft: 30 - parseInt(time / 60)
      });
    }
  },
  onReady: function () {
    for (var i = 1; i < 5; i++) {
      this['card' + i] = wx.createAnimation({ timingFunction: 'ease-in-out' })
    }
  },
  toGenerate: function () {
    var that = this;
    for (var i = 1; i < 5; i++) {
      this['card' + i].translateX(75 - 30 * i).step({ duration: 800 })
      this['card' + i].translateY(20).step({ duration: 400 , delay: 100 * i - 100 })
      this['card' + i].translateY(-20).step({ duration: 400 })
      this['card' + i].translateY(20).step({ duration: 400 })
      this['card' + i].translateY(-20).step({ duration: 400 })
      this['card' + i].translateY(20).step({ duration: 400 })
      this['card' + i].translateY(0).step({ duration: 400 })
    }
    this.card1.translate(45, -113).step({ duration: 200, delay: 400});
    this.card2.translate(75, 108).step({ duration: 200, delay: 300});
    this.card3.translate(-75, 108).step({ duration: 200, delay: 200});
    this.card4.translate(-45, -113).step({ duration: 200, delay: 100});
    for (var i = 1; i < 5; i++) {
      this['card' + i].opacity(0).step({ duration: 200 });
    }
    this.setData({
      //输出动画
      ifLoading: true,
      card1: this.card1.export(),
      card2: this.card2.export(),
      card3: this.card3.export(),
      card4: this.card4.export()
    })
    setTimeout(function () {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      wx.setStorage({
        key: "date",
        data: timestamp
      })
      that.setData({
        onResult: true,
        ifLoading: false
      });
    }, 4300)
  },
  toCancel: function () {
    wx.navigateBack({
      delta: 1
    })
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
      url: '/pages/detail/detail?name='+ food.name
      + '&place=' + food.place
      + '&area=' + food.area
      + '&price='+ food.price
      + '&popular=' + food.rate.popular
      + '&chilli=' + food.rate.chilli
      + '&time=' + food.rate.time
      + '&seat=' + food.rate.seat
      + '&pic=' + food.pic
      + '&likeStyle=' + likeStyle
    })
  }
})