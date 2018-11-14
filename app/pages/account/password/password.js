// pages/account/password/password.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    valid:'',
    password: '',
    new_password: '',
    timmer: '',
    valid_disabled: false,
    valid_text: '获取验证码'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },
  bindGetValid: function () {
    if (this.data.phone && (/^1[3456789]\d{9}$/.test(this.data.phone))) {
      this.countDown(60);
      app.https(app.api.smsSendApi, {
        'username': this.data.phone
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
  countDown: function (time) {
    var that = this;
    clearInterval(that.data.timmer);
    time = time || 60;
    that.setData({
      valid_disabled: true,
      valid_text: time + '秒后重发'
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
        valid_text: time + '秒后重发'
      });
    }, 1000);
  },
  formSubmit: function (e) {
    var that = this;
    if (e.detail.value && e.detail.value.phone && e.detail.value.valid && e.detail.value.password && e.detail.value.new_password) {
      app.https(app.api.forgotPasswordApi, {
        'username': e.detail.value.phone,
        'password': e.detail.value.valid,
        'newpassword': e.detail.value.password,
      }, 'post').then(function (data) {
        data = data.data;
        var token = wx.setStorageSync('user', "");
        wx.reLaunch({
          url: '/pages/account/login/login'
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
        title: '请输入必填项',
        icon: 'none'
      });
    }
  }
})