// pages/help/help.js
Page({
  data: {

  },
  onLoad: function (options) {
  
  },
  onShow: function () {
  
  },
  handletap: function () {
    wx.previewImage({
      urls: ['http://pic.ustb.wang/jasongao.jpg'] // 需要预览的图片http链接列表
    })
  },
  clearTimer: function () {
    wx.removeStorage({
      key: 'date'
    })
  }
})