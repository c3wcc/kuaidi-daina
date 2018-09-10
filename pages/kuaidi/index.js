
const APP_ID = 'wx2c985a73e416f727';//输入小程序appid  
const APP_SECRET = 'cad42e76b18a5854f201b7ebceb024f4';//输入小程序app_secret  
var OPEN_ID = ''//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_key  

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '开始发送',
    shop: '进入商城',
    login: '登录',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //事件处理函数
  bindViewTap: function () {
   this.login();
  },

  //事件处理函数
  sendmsg: function () {
    wx.navigateTo({
      url: '../send/send'
    })
  },

  //事件处理函数
  login: function () {
    var mobile = wx.getStorageSync('mobile');
    if (mobile) {
      //存在，直接进入
      wx.navigateTo({
        url: '../send/send'
      })
    } else {
      //不存在，去登录
      wx.navigateTo({
        url: '../login/login'
      })
    }

  },

  //进入商城
  toshop: function () {
    wx.navigateTo({
      url: '../shop/shop'
    })
  },

  onLoad: function () {

    //获取用户信息
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log(res.userInfo);
        //这里去登录
        var uid = this.getuid();
        console.log(uid);
      },
      fail: res => {
        console.log("拒绝");
        //停止服务
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法正常使用的功能体验。请10分钟后再次点击授权，或者删除小程序重新进入。',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    });


    var uid = wx.getStorageSync('uid');

    if (uid == "" || uid.length > 30) {
      //如果存储为空
      uid = this.getuid();
      //uid = wx.getStorageSync('uid');
    }

    console.log(uid);

    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo);
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        //console.log(res);
        // console.log(res.encryptedData);
        // console.log(res.iv);
        //不调用了，用其他方法
        //this.getunionid(res.encryptedData, res.iv);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }


  },

  getUserInfo: function (e) {
    //console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getuid: function () {
    var that = this;
    wx.login({
      success: function (res) {
        wx.request({
          url: 'https://api.c3w.cc/index.php?m=lang&c=index&a=getuid',
          data: {
            appid: APP_ID,
            secret: APP_SECRET,
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          method: 'GET',
          success: function (res) {
            var uid = res.data;
            wx.setStorageSync('uid', uid);
            //再去取mobile
            that.getmobile(uid);

            return uid;
          }
        })
      }
    })
  },

  getmobile: function (uid) {
    if (!uid){
      console.log("UID不存在")
    }
    wx.request({
      url: 'https://api.c3w.cc/index.php?m=lang&c=index&a=getmobile',
      data: {
        uid: uid
      },
      method: 'GET',
      success: function (res) {
        if(res.data.sign == 1){
          wx.setStorageSync('mobile', res.data.code);
        }
        console.log(res.data.code)
      
      }
    })
  }

})
