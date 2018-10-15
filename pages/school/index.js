import Page from '../../common/page';
const APP_ID = 'wx2c985a73e416f727';//输入小程序appid  
const APP_SECRET = 'cad42e76b18a5854f201b7ebceb024f4';//输入小程序app_secret  
var OPEN_ID = ''//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_key  

const app = getApp()

Page({

  onLoad: function () {

    var user_id = app.globalData.user_id;

    console.log(user_id);

  }


})