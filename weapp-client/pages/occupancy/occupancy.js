// pages/occupancy/occupancy.js
function drawChart(array) {
  const ctx = wx.createCanvasContext('chart')

  ctx.beginPath()
  ctx.setStrokeStyle('#F4F4F4')
  ctx.setLineWidth(4)
  ctx.lineTo(20, 170)
  ctx.lineTo(20, 160)
  ctx.lineTo(260, 160)
  ctx.lineTo(260, 170)
  ctx.stroke()
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.lineTo(80 + 60 * i, 160)
    ctx.lineTo(80 + 60 * i, 170)
    ctx.stroke()
  }

  ctx.setLineWidth(2)
  ctx.beginPath()
  ctx.setStrokeStyle('#FF7070')
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(20 + 60 * i, 160 - array[0][i] * 14)
  }
  ctx.stroke()

  if (array[1]) {
    ctx.beginPath()
    ctx.setStrokeStyle('#70A0FF')
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(20 + 60 * i, 160 - array[1][i] * 14)
    }
    ctx.stroke()
  }

  if (array[2]) {
    ctx.beginPath()
    ctx.setStrokeStyle('#3AD86A')
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(20 + 60 * i, 160 - array[2][i] * 14)
    }
    ctx.stroke()
  }

  if (array[3]) {
    ctx.beginPath()
    ctx.setStrokeStyle('#FFBD73')
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(20 + 60 * i, 160 - array[3][i] * 14)
    }
    ctx.stroke()
  }

  ctx.setFillStyle('#FFFFFF')
  ctx.setLineWidth(4)
  for (let i = 0; i < 5; i++) {
    ctx.setStrokeStyle('#ff7070')
    ctx.beginPath()
    ctx.arc(20 + 60 * i, 160 - array[0][i] * 14, 4, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fill()
    if (array[1]) {
      ctx.setStrokeStyle('#70A0FF')
      ctx.beginPath()
      ctx.arc(20 + 60 * i, 160 - array[1][i] * 14, 4, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.fill()
    }
    if (array[2]) {
      ctx.setStrokeStyle('#3AD86A')
      ctx.beginPath()
      ctx.arc(20 + 60 * i, 160 - array[2][i] * 14, 4, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.fill()
    }
    if (array[3]) {
      ctx.setStrokeStyle('#FFBD73')
      ctx.beginPath()
      ctx.arc(20 + 60 * i, 160 - array[3][i] * 14, 4, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.fill()
    }
  }

  ctx.draw()
}

Page({
  onShareAppMessage: function () {
    var that = this;
    var url = '/pages/occupancy/occupancy?title=' + that.data.title
      + '&areaArr=' + that.data.forShare.areaArr
      + '&nameArr=' + that.data.forShare.nameArr
      + '&stateStr=' + that.data.forShare.stateStr
      + '&ifShare=true'
    return {
      title: that.data.title + ' ' + that.data.statusdescription,
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
    title: '',
    statusdescription: '',
    imgurl: '/images/block/block',
    description: {
      popular: ['小众', '少见', '常见', '热门', '火爆'],
      chilli: ['不辣', '微辣', '中辣', '超辣', '极辣'],
      time: ['很快', '约2分钟', '约5分钟', '约10分钟', '10分钟以上'],
      seat: ['空闲', '很多', '少量', '紧张', '无座']
    },
    dish: {
      "name": "烤鱼",
      "pic": "ky.gif",
      "place": "友谊餐厅",
      "area": "一层",
      "price": "￥30",
      "rate": {
        "popular": "4",
        "chilli": "3",
        "time": "4",
        "seat": "2"
      }
    },
    time: [],
    information: []
  },
  onLoad: function (options) {
    var date = new Date();
    var hours = date.getHours(), minutes = date.getMinutes()
    var status = (minutes < 30) ? hours * 2 : hours * 2 + 1;
    var time = (minutes < 30) ? [(hours - 1) + ':30', hours + ':00', hours + ':30', (hours + 1) + ':00', (hours + 1) + ':30'] : [hours + ':00', hours + ':30', (hours + 1) + ':00', (hours + 1) + ':30', (hours + 2) + ':00'];
    this.setData({
      'forShare': options,
      'time': time,
      'ifShare': options.ifShare
    })

    var stateArr = options.stateStr.split('-');
    var areaArr = options.areaArr.split(',');
    var nameArr = options.nameArr.split(',');
    var infoArr = [];
    for (let i = 0 ; i < areaArr.length; i++) {
      infoArr.push({"area": areaArr[i], "name": nameArr[i]})
    }
    this.setData({
      title: options.title,
      information: infoArr
    })

    var Arr = []
    for (let i = 0 ;i < stateArr.length; i++) {
      Arr.push(stateArr[i].split(',').slice(status - 1, status + 4))
    }
    if (Arr[0][4] - Arr[0][1] > 3) this.setData({ statusdescription: '未来人数将逐渐走高'})
    else if (Arr[0][4] - Arr[0][1] < 3) this.setData({ statusdescription: '未来人数将逐渐走低' })
    else this.setData({ statusdescription: '未来人数将维持不变' })
    
    drawChart(Arr);
  },
  onShow: function () {
    var that = this;
    wx.request({
      url: 'https://www.ustb.wang/getRandomFood',
      method: 'GET',
      success: function(res) {
        that.setData({
          dish: res.data.food
        })
      }
    });
  },
  //去美食详情
  toDetail: function (event) {
    var dish = this.data.dish
    var that = this

    var likeStyle = 'like';
    wx.getStorage({
      key: 'likedFood',
      success: function(res) {
        for (var i in res.data) {
          if (res.data[i].name === dish.name) {
            likeStyle = 'liked'
            break;
          }
        }
      },
      complete: function () {
        if (that.data.ifShare) {
          wx.navigateTo({
            url: '/pages/detail/detail?name=' + dish.name
            + '&place=' + dish.place
            + '&area=' + dish.area
            + '&price=' + dish.price
            + '&popular=' + dish.rate.popular
            + '&chilli=' + dish.rate.chilli
            + '&time=' + dish.rate.time
            + '&seat=' + dish.rate.seat
            + '&pic=' + dish.pic
            + '&likeStyle=' + likeStyle
            + '&ifShare=true'
          })
        } else {
          wx.navigateTo({
            url: '/pages/detail/detail?name=' + dish.name
            + '&place=' + dish.place
            + '&area=' + dish.area
            + '&price=' + dish.price
            + '&popular=' + dish.rate.popular
            + '&chilli=' + dish.rate.chilli
            + '&time=' + dish.rate.time
            + '&seat=' + dish.rate.seat
            + '&pic=' + dish.pic
            + '&likeStyle=' + likeStyle
          })
        }
      }
    })
    
  },
  //回到首页
  toIndex: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
})