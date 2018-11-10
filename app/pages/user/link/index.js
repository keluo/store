// pages/user/link/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    qq: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getInfo();
  },
  getInfo: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      app.https(app.api.serviceLinkApi, {
      }, 'get').then(function (data) {
        data = data.data;
        that.setData({
          phone: data.phone || '',
          qq: data.qq || ''
        });
        resolve();
      });
    });
  }
})