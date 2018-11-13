// pages/user/money/add/success.js
var app = getApp();
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
    if (options && options.fee){
      this.setData({
        fee: options.fee
      });
    }
    app.https(app.api.bgInfoApi, {
    }, 'get').then(function (data) {
      data = data.data;
      app.globalData.fee = data.now_fee || 0;
    });
  },
  bindToComplete: function(){
    wx.switchTab({
      url:'/pages/user/index/index'
    });
  }
})