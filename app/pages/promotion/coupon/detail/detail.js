// pages/promotion/coupon/detail/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount:0,
    floor_amount: 0,
    valid_daytime:'',
    valid_period: '',
    send_total_count: 0,
    used_total_count: 0,
    vsdc: [],
    vudc: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id || '';
    that.setData({
      id: id
    });
    that.getInitInfo();
  },
  getInitInfo: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      app.https(app.api.couponAddApi, {
        id: that.data.id
      }, 'get').then(function (data) {
        data = data.data;
        that.setData({
          amount: data.amount || 0,
          floor_amount: data.floor_amount || 0,
          valid_period: data.valid_period || '',
          valid_daytime: data.valid_daytime || '',
          send_total_count: data.send_total_count || 0,
          used_total_count: data.used_total_count || 0,
          vsdc: data.vsdc || [],
          vudc: data.vudc || [],
        });
        resolve();
      });
    });
  }
})