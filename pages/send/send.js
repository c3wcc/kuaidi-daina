const APP_ID = 'wx2c985a73e416f727';//输入小程序appid  
const APP_SECRET = 'cad42e76b18a5854f201b7ebceb024f4';//输入小程序app_secret  
var OPEN_ID = ''//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_key  

const app = getApp()



Page({

  onLoad: function () {
    var uid = wx.getStorageSync('uid');
   
    //一加载就调用

    this.getkuaidi();

    this.setData({
      tip: "请输入手机号码",
    })
  },

  data: {
    showTopTips: false,
    kuaidi: '',//这里是空的，后面再赋值
    kuaidiIndex: 0,
    kd:"",
    time:"",
    addr:"",
    num:""
  },

  showTopTips: function (e) {
    var that = this;
    this.setData({
      showTopTips: true,
      tip:e
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  

  bindkuaidiChange: function (e) {
    var kuaidi = this.data.kuaidi;

    console.log('选择了种类：', kuaidi[e.detail.value]);
   
    this.setData({
      kuaidiIndex: e.detail.value,
      kd: kuaidi[e.detail.value]
    })
  },

  openToast: function () {
    wx.showToast({
      title: '已完成',
      icon: 'success',
      duration: 3000
    });
  },
  openLoading: function () {
    wx.showToast({
      title: '正在发送',
      icon: 'loading',
      duration: 300
    });
  },

  getkuaidi:function(){
    var that = this;
    //去获取快递种类
    wx.request({
      url: 'https://api.c3w.cc/index.php?m=lang&c=index&a=kd',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          kuaidi: res.data
        })
       
      }
    })
    
    
  },
  
  formSubmit: function (e) {
    var that = this;
    var formData = e.detail.value;
    
    if (formData.kd == "请选择"){
      this.showTopTips("快递类型不能为空");
      return false;
    };
    if (formData.time == 0) {
      this.showTopTips("取件时间不能为空");
      return false;
    };
    if (formData.time.length > 10) {
      this.showTopTips("取件时间太长");
      return false;
    };
    if (formData.addr == 0) {
      this.showTopTips("取件地点不能为空");
      return false;
    };
    
    if (formData.addr.length >= 10) {
      this.showTopTips("取件地点太长");
      return false;
    };
    if (formData.num == 0) {
      this.showTopTips("手机号码不能为空");
      return false;
    };
    if (formData.num.length != 11) {
      this.showTopTips("请输入11位手机号码");
      return false;
    };
    if (!(/^1[34578]\d{9}$/.test(formData.num))) {
      this.showTopTips("手机号码不正确");
      return false;
    }

    wx.request({
      url: 'https://api.c3w.cc/index.php?m=lang&c=index&a=send',
      data: formData,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
       
        console.log(res.data);
        if(res.data=="OK"){
          console.log("发送成功");
          that.setValue();
        }else{
          that.showTopTips(res.data);
        }
        // that.modalTap();
      }
    })

    this.openLoading()
  },  

  setValue: function () {
    this.setData({
      value: ""
    }),
    this.setData({
      tip: "继续输入手机号码"
    })
  },

  //去发送历史
  history: function () {
      wx.navigateTo({
        url: '../history/history'
      })
   
  },



//回车发送模式
  send:function(){
    var that = this;
    var formData = this.data; 

    if (formData.kd == "请选择") {
      this.showTopTips("快递类型不能为空");
      return false;
    };
    if (formData.time == 0) {
      this.showTopTips("取件时间不能为空");
      return false;
    };
    if (formData.time.length > 10) {
      this.showTopTips("取件时间太长");
      return false;
    };
    if (formData.addr == 0) {
      this.showTopTips("取件地点不能为空");
      return false;
    };

    if (formData.addr.length >= 10) {
      this.showTopTips("取件地点太长");
      return false;
    };
    if (formData.num == 0) {
      this.showTopTips("手机号码不能为空");
      return false;
    };
    if (formData.num.length != 11) {
      this.showTopTips("请输入11位手机号码");
      return false;
    };
    if (!(/^1[34578]\d{9}$/.test(formData.num))) {
      this.showTopTips("手机号码不正确");
      return false;
    };
    var uid = wx.getStorageSync('uid');
    wx.request({
      
      url: 'https://api.c3w.cc/index.php?m=lang&c=index&a=send&uid='+uid,
      data: formData,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {

        console.log(res.data);
        if (res.data == "OK") {
          console.log("发送成功"+uid);
          that.setValue();
        } else {
          that.showTopTips(res.data);
        }
        // that.modalTap();
      }
    })

    this.openLoading()
  },

  //获取用户输入的时间
  timeInput: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  //获取用户输入的地址
  addrInput: function (e) {
    this.setData({
      addr: e.detail.value
    })
  },
  //获取用户输入的号码
  numInput: function (e) {
    this.setData({
      num: e.detail.value
    })
  },
  

  



})