// pages/user/password/reset.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    old_password: '',
    new_password: '',
    new_password_ext: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      username: wx.getStorageSync('user').username || ""
    });
  },
  bindCancel:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  formSubmit: function (e) {
    var that = this;
    if (e.detail.value && e.detail.value.old_password && e.detail.value.new_password && e.detail.value.new_password_ext) {
      app.https(app.api.restPasswordApi, {
        'password': e.detail.value.old_password,
        'newpassword': e.detail.value.new_password,
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
        title: '请输入密码',
        icon: 'none'
      });
    }
  }
})