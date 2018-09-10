var server = require('../../utils/server');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var seat;
var isLoc = false;
var app = getApp();
Page({
  data: {
    "address": "定位中",
    banner: [],
    goods: [],
    bannerHeight: Math.ceil(290.0 / 750.0 * getApp().screenWidth)
  },
  showLogin: function(e) {
    wx.navigateTo({
      url: '../login/login',
      success: function(res) {
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  showKuaidi: function(e) {
    wx.navigateTo({
      url: '../kuaidi/index',
      success: function(res) {
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  showHistory: function(e) {
    wx.navigateTo({
      url: '../history/history',
      success: function(res) {
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  showIndex: function(e) {
    wx.navigateTo({
      url: '../kuaidi/index',
      success: function(res) {
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  showMine: function(e) {
    wx.switchTab({
      url: "../member/index/index"
    });
  },
  showShare: function(e) {
    wx.navigateTo({
      url: "../member/share/index/index"
    });
  },

  showSeller: function(e) {
    wx.switchTab({
      url: '../seller/index'
    })
  },
  search: function(e) {
    wx.navigateTo({
      url: "../search/index"
    });
  },
  showCarts: function(e) {
    wx.switchTab({
      url: "../cart/cart"
    });
  },
  onLoad: function(options) {
    var that = this;

    //弹窗提醒来自用户 XX 的分享
    this.getInviteCode(options);


    app.getOpenId(function() {

      var openId = getApp().globalData.openid;

      console.log(openId);

      server.getJSON("/User/validateOpenid", {
        openid: openId
      }, function(res) {

        if (res.data.code == 200) {
          getApp().globalData.userInfo = res.data.data;
          getApp().globalData.login = true;

          //执行判断跳转
          that.tiaozhuang();
        } else {
          if (res.data.code == '400') {
            console.log("need register");

            app.register(function() {
              getApp().globalData.login = true;
              //执行判断跳转
              that.tiaozhuang();
            });
          }
        }

      });

    });

  },

  tiaozhuang: function() {
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 2000
    })
    setTimeout(function() {
      //判断 是否有手机号码
      console.log("判断 是否有手机号码");
      var mobile = app.globalData.userInfo.mobile;

      if (mobile == null || mobile.length < 11) {
        console.log("没有手机号码");
        wx.redirectTo({
          url: "../login/login"
        });
      }
    }, 800)

  },



  getInviteCode: function(options) {

    if (options.uid != undefined) {
      //去请求分销关系接口
      this.distribution(options.uid);

      wx.showToast({
        title: '来自用户:' + options.uid + '的分享',
        icon: 'success',
        duration: 2000
      })
    }

    if (options.scene != undefined) {
      //去请求分销关系接口
      this.distribution(options.scene);

      wx.showToast({
        title: '来自用户:' + options.scene + '的分享',
        icon: 'success',
        duration: 2000
      })
    }


  },

  //分销关系接口
  distribution: function(first_leader) {
    var user_id = wx.getStorageSync('user_id');
    console.log("用户：" + user_id + "的上级是：" + first_leader);
    if (first_leader != undefined) {
      setTimeout(function() {
        //要延时执行的代码  
        server.getJSON("/User/distribution", {
          first_leader: first_leader,
          user_id: user_id
        }, function(res) {
          console.log(res.data.msg);
        })
      }, 4000)
      //延迟时间 这里是4秒  
    }
  },

  loadBanner: function() {
    var that = this;
    var city = that.data.address;

    city = encodeURI(city);
    server.getJSON("/Index/home", {
      city: that.data.address
    }, function(res) {
      // var banner = res.data.result.ad;
      // var goods = res.data.result.goods;
      // var ad = res.data.ad;
      // that.setData({
      //   banner: banner,
      //   goods: goods,
      //   ad: ad
      // });
    });

  },
  loadMainGoods: function() {
    var that = this;
    var query = new AV.Query('Goods');
    query.equalTo('isHot', true);
    query.find().then(function(goodsObjects) {
      that.setData({
        goods: goodsObjects
      });
    });
  },
  onShow: function() {
    var app = getApp();
    var self = this;

    if (isLoc) {
      var address = getApp().globalData.city;
      this.setData({
        address: address
      });
      self.loadBanner();
      return;
    }
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;

        app.globalData.lat = latitude;
        app.globalData.lng = longitude;

        // 实例划API核心类
        var map = new QQMapWX({
          key: 'ORXBZ-YWJ3X-ZTP4D-7IRW5-F7L7T-2SBXX' // 必填
        });
        //address: res.result.address_component.city
        // 调用接口
        map.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {
            console.log(res);

            if (res.result.ad_info.city != undefined) {
              self.setData({

                address: res.result.ad_info.city
              });
              getApp().globalData.city = res.result.ad_info.city;
              isLoc = true;
              self.loadBanner();
            }
          },
          fail: function(res) {
            console.log(res);
          },
          complete: function(res) {
            console.log("地址获取完成");
            //console.log(res);
          }
        });
      }
    })



  },
  clickBanner: function(e) {

    var goodsId = e.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url: "../goods/detail/detail?objectId=" + goodsId
    });
  },


  onShareAppMessage: function() {
    var user_id = getApp().globalData.user_id;
    console.log(user_id);
    return {
      title: '快递代拿代取',
      desc: '百所高校本地化平台，一站式服务平台',
      path: '/pages/index/index?scene=' + user_id
    }
  }

})