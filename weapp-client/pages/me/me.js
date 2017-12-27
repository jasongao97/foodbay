// pages/me/me.js
Page({
  switchCanteenEdit: function(event) {
    if (event.detail.value) {
      wx.setStorage({
        key: "ifShowCanteenEdit",
        data: true
      })
    } else {
      wx.setStorage({
        key: "ifShowCanteenEdit",
        data: false
      })
    }
  },
  toHelp: function() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    })
  },
  toAbout: function () {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },
  data: {
  
  },
  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'ifShowCanteenEdit',
      success: function (res) {
        that.setData({
          ifShowCanteenEdit: res.data
        })
      }
    });
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  }
})