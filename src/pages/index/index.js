import {hijackProperty} from '../../utils/util'
import {calcPregnancyWeeks} from '../../utils/common'

//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
      motto: 'Hello World',
      userInfo: {},
      modalHidden: true,
      sayHi: {
        hiText: '你好',
        clickHiText: 'sayHi.clickHiText'
      }
  },

  events: {
    onModalConfirm(e) {
      this.modalHidden = true;
    },

    onModalCancel(e) {
      this.onModalConfirm(e);
    },

    showModal() {
      this.modalHidden = false;
    },

    //事件处理函数
    bindViewTap: function() {
      wx.navigateTo({
        url: '../logs/logs'
      })
    },

    'sayHi.clickHiText': function() {
        wx.hideToast();
        wx.showToast({title: '你好'});
    }
  },

  // onShareAppMessage() {

  // },

  onReady: function() {
    // 劫持page实例的data属性的所有字段，简化setData操作，直接通过赋值实现数据和试图变更
    hijackProperty(this.data, this);
    hijackProperty(this.events, this, null, false);
  },

  onLoad: function () {
    // wx.showShareMenu();
    console.log('onLoad')
    //调用应用实例的方法获取全局数据
    app.getUserInfo(userInfo => {
      wx.showToast({title: userInfo.nickName});
      //更新数据
      this.setData({
        userInfo:userInfo
      })
    })

    setTimeout(() => {
      // this.setData({motto: '666'});
      this['motto'] = 666;
    }, 2000);
  }
});