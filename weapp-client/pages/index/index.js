//index.js
//获取应用实例
var app = getApp()

var getList = function (that, userId, userInfo) {
  wx.showNavigationBarLoading()
  wx.request({
    url: 'https://www.ustb.wang/getUserCanteen',
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
        that.setData({
          place: res.data.place
        })
        var checkedArr = res.data.checked;
        var becheckedArr = that.data.place;
        for (var i = 0; i < checkedArr.length; i++) {
          for (var j = 0; j < becheckedArr.length; j++) {
            var param = {}
            var str = 'place[' + j + '].checked'
            if (checkedArr[i] == becheckedArr[j].title) {
              param[str] = true;
              that.setData(param);
            }
          }
        }
      }
    },
    complete: function () {
      wx.hideNavigationBarLoading()
    }
  })
}

Page({
  data: {
    str: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ifShowEdit: true,
    ifEdit: false
  },
  toEdit: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff7070',
      animation: {
        duration: 100,
        timingFunc: 'easeIn'
      }
    })
    wx.setNavigationBarTitle({
      title: '正在编辑位置'
    })
    this.setData({
      ifEdit: true
    })
  },
  finnishEdit: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#222',
      animation: {
        duration: 100,
        timingFunc: 'easeIn'
      }
    })
    wx.setNavigationBarTitle({
      title: '座位情况'
    })
    this.setData({
      ifEdit: false
    })
    var dataToSend = [];
    for (var i = 0; i < this.data.place.length; i++) {
      if (this.data.place[i].checked == true) {
        dataToSend.push(this.data.place[i].title);
      }
    }
    wx.request({
      url: 'https://www.ustb.wang/updateUserCanteen',
      data: {
        id: wx.getStorageSync('userId'),
        checked: dataToSend
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        wx.showToast({
          title: '编辑成功',
          icon: 'success',
          duration: 800
        })
      }
    })
  },
  //switch切换后
  switchChange: function (event) {
    var param = {};
    var str = 'place[' + event.currentTarget.id + '].checked'
    if (event.detail.value) {
      param[str] = true;
      this.setData(param);
    } else {
      param[str] = false;
      this.setData(param);
    }
  },
  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      fail: function () {
        wx.login({
          success: function () {
            wx.getUserInfo({
              success: function (res) {
                wx.setStorageSync('userInfo', res.userInfo);
                var userId = wx.getStorageSync('userId');
                var userInfo = wx.getStorageSync('userInfo');
                getList(that, userId, userInfo);
              }
            })
          }
        });
      },
      success: function () {
        var userId = wx.getStorage({
          key: 'userId',
          success: function (res) {
            var userInfo = wx.getStorageSync('userInfo');
            getList(that, res.data, userInfo);
          }
        });
      }
    });
  },
  onShow: function () {
    var date = new Date();
    var status = (date.getMinutes() < 30) ? date.getHours() * 2 : date.getHours() * 2 + 1;
    this.setData({
      status: status
    })
    var that = this;
    wx.getStorage({
      key: 'ifShowCanteenEdit',
      success: function (res) {
        that.setData({
          ifShowEdit: res.data
        })
      },
      fail: function () {
        wx.setStorage({
          key: "ifShowCanteenEdit",
          data: true
        })
      }
    })
  },
  toOccupancy: function (event) {
    var canteen = this.data.place[event.currentTarget.id]
    var areaArr = [], nameArr = [], stateStr = '';
    for (let i = canteen.information.length - 1; i >= 0; i--) {
      areaArr.push(canteen.information[i].area)
      nameArr.push(canteen.information[i].name)
      stateStr += canteen.information[i].state
      if (i > 0)
      stateStr += '-'
    }
    
    wx.navigateTo({
      url: '/pages/occupancy/occupancy?title=' + canteen.title
      + '&areaArr=' + areaArr
      + '&nameArr=' + nameArr
      + '&stateStr=' + stateStr
    })
  },
  onPullDownRefresh: function () {
    var date = new Date();
    var status = (date.getMinutes() < 30) ? date.getHours() * 2 : date.getHours() * 2 + 1;
    this.setData({
      status: status
    })
    var userId = wx.getStorageSync('userId');
    var userInfo = wx.getStorageSync('userInfo');
    getList(this, userId, userInfo);
    wx.stopPullDownRefresh();
  }
})
