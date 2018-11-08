// pages/promotion/coupon/list/list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromday: '',
    range_date_group: [],
    coupon_list:[],
    hasNotMore: true,
    isLoadingMore: false,
    page: 1,
    total: 0
  },
  bindToPage: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/promotion/coupon/detail/detail?id=' + id,
    });
  },
  bindDateSelected: function (e) {
    this.setData({
      page: 1,
      coupon_list: [],
      fromday: e.detail
    });
    this.getList();
  },
  getSelectInitList: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      app.https(app.api.couponListInitApi, {
      }, 'get').then(function (data) {
        data = data.data;
        that.setData({
          range_date_group: data.list_day || []
        });
        resolve();
      });
    });
  },
  getList: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      app.https(app.api.couponListApi, {
        page: that.data.page,
        length: 10,
        fromday: that.data.fromday
      }, 'get').then(function (data) {
        data = data.data;
        var coupon_list = that.data.coupon_list.concat(data.vcts || []);
        that.setData({
          coupon_list: coupon_list,
          total: data.total_count || 0,
          hasNotMore: coupon_list.length === data.total_count,
          page: (coupon_list.length === data.total_count) ? that.data.page : (that.data.page + 1)
        });
        resolve();
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getSelectInitList();
    that.getList();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      coupon_list: []
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