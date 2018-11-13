// pages/common/loading/loading.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.timmer = setTimeout(function () {
      var token = wx.getStorageSync('user') || '';
      if (!token) {
        wx.reLaunch({
          url: '/pages/account/login/login'
        });
      } else {
        wx.switchTab({
          url: '/pages/promotion/index/index'
        });
      }

    },3000);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onUnload: function () {
    clearTimeout(this.timmer);
  }
})