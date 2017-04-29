import {makeWxSupportPromise} from './utils/wx-promise'

//app.js
App({
  onLaunch: function () {
    makeWxSupportPromise();
  },
  getUserInfo: function(cb){
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login()
        .then(() => {
            return wx.getUserInfo();
        })
        .then(res => {
            this.globalData.userInfo = res.userInfo
            typeof cb == "function" && cb(res.userInfo)
        });
    }
  },
  globalData:{
    userInfo: null
  }
})