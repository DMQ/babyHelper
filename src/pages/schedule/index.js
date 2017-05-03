import { hijackProperty } from '../../utils/util'
import {dateFormat} from '../../utils/util'

//index.js
//获取应用实例
var app = getApp()

Page({
    data: {
        userInfo: {
            avatarUrl: 'https://placeholdit.imgix.net/~text?txtsize=24&txt=加载中...&w=128&h=128&bg=f0f0f0'
        },
        scheduleDate: '',
        scheduleTime: '',
        address: ''
    },

    events: {
        onScheduleDateChange(e) {
            this.scheduleDate = e.detail.value;
        },

        onScheduleTimeChange(e) {
            this.scheduleTime = e.detail.value;
        },

        selectAddress() {
            wx.chooseLocation().then(res => {
                this.address = res.name;
            })
        },

        onFormSubmit(e) {
            if (this.valideFormData(e.detail.value)) {
                this.pushTplMessage(e.detail);
            }
        }
    },

    pushTplMessage(formDetail) {
        wx.showLoading({title: '提交中...'});
        
        return Promise.all([app.getOpenId(), app.getAccessToken()])
                .then(([openId, token]) => {
                    return this.sendMessage(openId, token, formDetail);
                }).then((res) => {
                    wx.showToast({title: '提交成功'})
                    console.log(res)
                }).catch(res => {
                    wx.hideLoading();
                    console.log(res)

                    let data = res && res.data || {};
                    wx.showModal({
                        title: '提交失败', 
                        content: `code: ${data.errcode}, msg: ${data.errmsg}`,
                        showCancel: false,
                        confirmText: 'ok'
                    });
                });
    },

    sendMessage(openId, token, formDetail) {
        return wx.request({
            url: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${token}`,
            method: 'POST',
            data: {
                touser: openId,
                template_id: '-_v9HkF5cvIOMCJ31ySvY8Vm_K9qmIZj5lMxBZ0R_Q0',
                form_id: formDetail.formId,
                page: 'pages/schedule/index',
                data: {
                    "keyword1": {
                        "value": formDetail.value.title, 
                        "color": "#bc83f3"
                    }, 
                    "keyword2": {
                        "value": `${formDetail.value.scheduleDate} ${formDetail.value.scheduleTime}`, 
                        "color": "#bc83f3"
                    }, 
                    "keyword3": {
                        "value": formDetail.value.address, 
                        "color": "#bc83f3"
                    } , 
                    "keyword4": {
                        "value": formDetail.value.people, 
                        "color": "#bc83f3"
                    } 
                }
            }
        }).then(res => {
            if (res && res.data && res.data.errcode == 0) {
                return Promise.resolve(res);
            } else {
                return Promise.reject(res);
            }
        });
    },

    valideFormData(value) {
        let valideObj = {
            title: '主题',
            address: '地点',
            people: '人数'
        }

        for(let key of Object.keys(valideObj)) {
            if (value[key] === undefined || value[key] === '') {
                wx.showModal({
                    title: '提示',
                    content: `${valideObj[key]}不能为空`, 
                    showCancel: false,
                    confirmText: 'ok'
                });
                return false;
            }
        }

        return true;
    },

    onLoad() {
        // 劫持page实例的data属性的所有字段，简化setData操作，直接通过赋值实现数据和试图变更
        hijackProperty(this.data, this);
        hijackProperty(this.events, this, false, 'events');
        this.init();
    },

    init() {
        //调用应用实例的方法获取全局数据
        app.getUserInfo().then(userInfo => {
            //更新数据
            this.userInfo = userInfo;
        })

        let now = new Date();
        this.scheduleDate = dateFormat(now, 'yyyy-MM-dd');
        this.scheduleTime = dateFormat(now, 'hh:mm');
    }
});