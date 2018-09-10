
const APP_ID = 'wx3a7bbe07b4d9c86d';//输入小程序appid  
const APP_SECRET = '73937578f590ce07756f968fe40a6dd5';//输入小程序app_secret 

var server = require('./utils/server');
var md5 = require('./utils/md5.js');
// 授权登录 
App({
  onLaunch: function (options) {
    // auto login via SDK
    var that = this;
    //AV.User.loginWithWeapp();

    this.data.uid = options.uid;
    //存着 传过来的 uid 参数
    if (!options.uid) {
      this.data.uid = 0;
    }
    //如果不存在，就是0


    // 设备信息
    wx.getSystemInfo({
      success: function (res) {
        that.screenWidth = res.windowWidth;
        that.pixelRatio = res.pixelRatio;
      }
    });
  },

  data: {
    'uid': null
  },

  getOpenId: function (cb) {
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log("code是：" + res.code);
          server.getJSON("/User/getOpenid", { url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + APP_ID + '&secret=' + APP_SECRET + '&js_code=' + res.code + '&grant_type=authorization_code&code=' + res.code }, function (res) {
            // 获取openId
            var openId = res.data.openid;

            // TODO 缓存 openId
            var app = getApp();
            var that = app;
            that.globalData.openid = openId;

            //验证是否关联openid

            typeof cb == "function" && cb()

            //储存user_id
            that.save_user_id(openId);
          });
          //发起网络请求
        }
      }
    });


  },

  save_user_id: function (openid) {
    server.getJSON("/User/getUserid", { openid: openid }, function (res) {
      var user_id = res.data.user_id;
      console.log("用户ID是：" + user_id);
      getApp().globalData.user_id = user_id;
      //储存user_id
      wx.setStorageSync('user_id', user_id);
    });
  },


  register: function (cb) {
    var first_leader = 0;
    wx.getStorage({
      key: 'scene',
      success: function (res) {
        first_leader = res.data;
        //console.log("first_leader=");
        //console.log(res.data);
      }
    })

    if (!first_leader || first_leader == 0) {
      console.log("first_leader不存在");
      var first_leader = this.data.uid
      console.log(first_leader);
    }

    var app = this;
    this.getUserInfo(function () {
      var openId = app.globalData.openid;
      console.log(openId);
      var userInfo = app.globalData.userInfo;
      var country = userInfo.country;
      var city = userInfo.city;
      var gender = userInfo.gender;
      var nick_name = userInfo.nickName;
      var province = userInfo.province;
      var avatarUrl = userInfo.avatarUrl;
      console.log(avatarUrl);

      server.getJSON('/User/register?openid=' + openId + "&appid=" + APP_ID + "&country=" + country + "&gender=" + gender + "&nick_name=" + nick_name + "&province=" + province + "&city=" + city + "&head_pic=" + avatarUrl + "&first_leader=" + first_leader, function (res) {
        app.globalData.userInfo = res.data.res

        typeof cb == "function" && cb()
      });

    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },


  globalData: {
    'openid': null,
    'user_id': null,
    'userInfo': null,
    'login': false
  }
})
