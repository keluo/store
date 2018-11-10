// pages/user/message/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message_list: [],
    hasNotMore: true,
    isLoadingMore: false,
    page: 1,
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getList();
  },
  getList: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      app.https(app.api.messageApi, {
        page: that.data.page,
        length: 10
      }, 'get').then(function (data) {
        data = data.data;
        var message_list = that.data.message_list.concat(data.notes || []);
        that.setData({
          message_list: message_list,
          total: data.total_count || 0,
          hasNotMore: message_list.length === data.total_count,
          page: (message_list.length === data.total_count) ? that.data.page : (that.data.page + 1)
        });
        resolve();
      });
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      message_list: []
    });
    this.getList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.isLoadingMore || that.data.hasNotMore) return;
    wx.showNavigationBarLoading();
    that.setData({
      isLoadingMore: true
    });
    that.getList().then(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      that.setData({
        isLoadingMore: false
      });
    });
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      that.setData({
        isLoadingMore: false
      });
    }, 3000);
  }
})