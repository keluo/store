// pages/account/login/login.js
let { loginApi } = require('../../../service/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    method: '1',
    username:'',
    password: ''
  },
  bindMethodSelected: function (e) {
    this.setData({
      method: this.data.method === '1' ? '3' : '1'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  formSubmit: function (e) {
    var that = this;
    if (e.detail.value && e.detail.value.username && e.detail.value.password) {
      app.https(loginApi, {
        'username': e.detail.value.username,
        'password': e.detail.value.password,
        'usertype': this.data.method,
        'openid': wx.getStorageSync('openid')
      }, 'post').then(function (data) {
        data = data.data;
        var token = wx.setStorageSync('user', {
          token: data.token || '',
          username: data.username || ''
        });
        wx.switchTab({
          url: '/pages/promotion/index/index'
        });
      }).catch(function (data) {
        wx.showToast({
          title: data.msg,
          icon: 'none',
          mask: true
        });
      });
    } else {
      let msg = this.data.method === '1' ? '请输入账号或密码' : '请输入手机号码或验证码';
      wx.showToast({
        title: msg,
        icon: 'none'
      });
    }
  }
})