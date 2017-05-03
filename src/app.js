import { makeWxSupportPromise } from './utils/wx-promise'
import EventEmitter from './utils/event-emitter'
import {setStorageSyncWithExpire, getStorageSyncWithExpire} from './utils/util'

//app.js
App({
    globalData: {
        appId: 'wx3e7c9a328b07ed28',
        appSecret: 'c5c27bc7baf18c5d5c53882c72c47012',
        userInfo: null
    },

    event: new EventEmitter(),
    
    onLaunch(options) {
        // 让wx的api支持promise
        makeWxSupportPromise();
        console.log(options)
    },

    getUserInfo(needOpenId) {
        if (this.globalData.userInfo) {
            return Promise.resolve(this.globalData.userInfo);
        }

        //调用登录接口
        return wx.login().then((res) => {
            return wx.getUserInfo();
        }).then(res => {
            this.globalData.userInfo = res.userInfo
            return res.userInfo;
        });
    },

    getOpenId() {
        let openId = wx.getStorageSync('openid');

        if (openId) return Promise.resolve(openId);

        let appid = this.globalData.appId;
        let secret = this.globalData.appSecret;
        return wx.login().then((res) => {
            return wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session',
                method: 'GET',
                data: {appid, secret, js_code: res.code, grant_type: 'authorization_code'},
                dataType: 'json'
            }).then(res => {
                wx.setStorage({key: 'openid', data: res.data.openid});
                return res.data.openid;
            });
        });
    },

    getAccessToken() {
        let token = getStorageSyncWithExpire('access_token');

        if (token) return Promise.resolve(token);

        let appid = this.globalData.appId;
        let secret = this.globalData.appSecret;
        return wx.request({
            url: 'https://api.weixin.qq.com/cgi-bin/token',
            type: 'GET',
            data: {appid, secret, grant_type: 'client_credential'}
        }).then(res => {
            if (!res || !res.data) return Promise.reject(res)

            setStorageSyncWithExpire('access_token', res.data.access_token, res.data.expires_in);
            return res.data.access_token;
        });
    }
})