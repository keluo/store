//app.js
var https = require('service/https.js');
import { loginApi } from './service/api'
App({
  onLaunch: function () {
    this.globalData = {};
    wx.login({
      success: res => {
        if (res && res.code && !wx.getStorageSync('openid')) {
          this.https(loginApi, {
            js_code: res.code
          }, 'get').then(function (data) {
            data = data.data;
            wx.setStorageSync('openid', data.openid);
          });
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
        }
      }
    })
    // 展示本地存储能力
    var token = wx.getStorageSync('user') || '';
    if (!token) {
      wx.redirectTo({
        url: '/pages/account/login/login'
      });
    }
  },
  https: https
})
