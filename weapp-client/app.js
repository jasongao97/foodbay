//app.js
//var appid = 'wxfdfdf440f7c53a21';
//var secret = '1048003943baf3b7138923b9a447c105';

App({
  onLaunch: function () {
    var that = this;
    //若首次登陆则获取用户openid
    wx.getStorage({
      key: 'userId',
      fail: function () {
        //获取用户openid
        wx.login({
          success: function (res) {
            var js_code = res.code;
            wx.request({
              url: 'https://www.ustb.wang/getUserOpenid',
              data: {
                code: js_code
              },
              method: 'POST',
              success: function (respond) {
                wx.setStorageSync('userId', respond.data.openid);
              }
            });
          }
        });
      }
    });
    //调用API修改缓存数据中userId
  },
  globalData:{
  }
})