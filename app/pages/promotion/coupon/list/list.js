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
  bindDateSelected: function (id) {
    this.setData({
      page: 1,
      page: [],
      fromday: id
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})