// pages/account/login/login.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    method: '1',
    username:'',
    password: '',
    timmer:'',
    valid_disabled:false,
    valid_text:'获取验证码'
  },
  inputPhone:function(e){
    this.setData({
      username: e.detail.value
    });
  },
  bindGetValid: function(){
    if (this.data.username){
      this.countDown(60);
      app.https(app.api.smsSendApi, {
        'username': this.data.username
      }, 'post').then(function (data) {
        wx.showToast({
          title: data.msg,
          icon: 'none',
          mask: true
        });
      }).catch(function (data) {
        wx.showToast({
          title: data.msg,
          icon: 'none',
          mask: true
        });
      });
    } else {
      wx.showToast({
        title: "请输入手机号码",
        icon: 'none',
        mask: true
      });
    }
  },
  countDown: function(time){
    var that = this;
    clearInterval(that.data.timmer);
    time = time || 60;
    that.setData({
      valid_disabled:true,
      valid_text: time + '秒后重新发送'
    });
    that.data.timmer = setInterval(function () {
      if (time < 2) {
        that.setData({
          valid_disabled: false,
          valid_text: '获取验证码'
        });
        clearInterval(that.data.timmer);
        return false;
      }
      time--
      that.setData({
        valid_text: time + '秒后重新发送'
      });
    }, 1000);
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
      app.https(app.api.loginApi, {
        'username': e.detail.value.username,
        'password': e.detail.value.password,
        'usertype': this.data.method,
        'openid': wx.getStorageSync('openid')
      }, 'post').then(function (data) {
        data = data.data;
        var token = wx.setStorageSync('user', {
          token: data.token || '',
          market_role: data.market_role || '',
          username: data.username
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