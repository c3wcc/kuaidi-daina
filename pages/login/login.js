const APP_ID = 'wx2c985a73e416f727';//输入小程序appid  
const APP_SECRET = 'cad42e76b18a5854f201b7ebceb024f4';//输入小程序app_secret  
var OPEN_ID = ''//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_key  

var server = require('../../utils/server');

const app = getApp()

var interval = null //倒计时函数
var flag = true


Page({

  onLoad:function(){
    var that = this;
    var openId = getApp().globalData.openid;
    server.getJSON("/User/validateOpenid", { openid: openId }, function (res) {
      if (res.data.code == 200) {
        var mobile =  res.data.data.mobile;
      }

      if (mobile) {
        wx.navigateTo({
          url: '../send/send'
        })
      }
      
    });

  },

  data: {
  
    showTopTips: false,
    showcode: "",
    //hide：隐藏
    time: '获取验证码', //倒计时 
    currentTime: 60
  },

  mobileInputEvent:function(e){
    console.log(e);
    
    var tempmobile = e.detail.value;
    
    if(tempmobile.length != 11){
      this.showTopTips("手机号码不正确");
      return false;
    }

    //储存
    wx.setStorageSync('tempmobile', tempmobile);

    console.log(tempmobile);
 },

  getCode: function (options) {
    var mobile = wx.getStorageSync('tempmobile');
    if (!mobile){
      that.showTopTips("手机号码不能为空");
      return false;
    }

    var that = this;
    var currentTime = that.data.currentTime
    if (flag == true) {
      //调用发短信函数
      this.tosendCode(mobile);
      interval = setInterval(function () {
        currentTime--;
        that.setData({
          time: currentTime + '秒后获取',
          showcode: ''
        })
        flag = false;
        if (currentTime <= 0) {
          flag = true;
          clearInterval(interval);
          that.setData({
            time: '获取验证码',
            currentTime: 60,
            disabled: false
          })
        }
      }, 1000)
    }
  },

  getVerificationCode() {
    this.getCode();
    var that = this
    that.setData({
      disabled: true
    })
  },

  showTopTips: function (e) {
    var that = this;
    this.setData({
      showTopTips: true,
      tip: e
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },

  //发送短信
  tosendCode: function (mobile) {
    
    var uid = app.globalData.user_id;

    var that = this;
    console.log(uid+"发了短信" + mobile);
    wx.request({
      url: 'https://api.c3w.cc/index.php?m=kuaidi&c=index&a=code',
      data: {
        mobile: mobile,
        uid: uid
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data);
        var status = res.data.status;
        if (status == -1) {
          that.showTopTips(res.data.msg);
        }
      }
    })
  },

  //检测验证码
  check_code:function(mobile,code){
    var uid = app.globalData.user_id;

    var that = this;
   console.log(code);
   console.log(uid);
   console.log(mobile);

    wx.request({
      url: 'https://api.c3w.cc/index.php?m=kuaidi&c=index&a=check',
      data: {
        mobile: mobile,
        uid: uid,
        code:code
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data);
        var status = res.data.status;
        if (status == -1) {
          that.showTopTips(res.data.msg);
        }
        if (status == 1){
          console.log("验证成功");
          //跳转
          wx.setStorageSync('mobile',mobile);
          wx.navigateTo({
            url: '../send/send'
          })
        }
      }
    })
  },

  formSubmit: function (e) {
    var that = this;
    
    var formData = e.detail.value;
    console.log(formData)
    if (formData.mobile == "") {
      this.showTopTips("手机号码不能为空");
      return false;
    };
    if (formData.code == "") {
      this.showTopTips("验证码不能为空");
      return false;
    };

    this.check_code(formData.mobile , formData.code);

  
  }


})
