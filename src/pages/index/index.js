import { hijackProperty } from '../../utils/util'
import { calcPregnancyWeeks } from '../../utils/common'
import {dateFormat} from '../../utils/util'

//index.js
//获取应用实例
var appInstance = getApp()

Page({
    data: {
        
    },

    events: {
        gotoSchedule() {
            wx.navigateTo({
              url: '/pages/schedule/index'
            })
        }
    },


    onLoad() {
        // 劫持page实例的data属性的所有字段，简化setData操作，直接通过赋值实现数据和试图变更
        hijackProperty(this.data, this);
        hijackProperty(this.events, this, false, 'events');
        this.init();
    },

    init() {
        
    }
});