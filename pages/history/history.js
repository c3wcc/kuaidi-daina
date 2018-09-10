const APP_ID = 'wx2c985a73e416f727';//输入小程序appid  
const APP_SECRET = 'cad42e76b18a5854f201b7ebceb024f4';//输入小程序app_secret  
var OPEN_ID = ''//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_key  

const app = getApp()


Page({
  data: {
    list: {}
  },
  
  onLoad: function (options) {
    var that = this;
    
    var uid = wx.getStorageSync('uid');

    wx.request({
      url: 'https://api.c3w.cc/index.php?m=lang&c=index&a=history&uid=' + uid,
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          list: res.data
        })
        // console.log(res.data)
      }
    })
  }
})
