// pages/about/about.js
Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  handlepic: function () {
    wx.previewImage({
      urls: ['http://pic.ustb.wang/wxapp-code.jpg'] // 需要预览的图片http链接列表
    })
  },
})