// pages/promotion/index/index.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabType:'1',
    range_date_group: [],
    fromday: '',
    create_count: 0,
    voucher_send_count: 0,
    voucher_used_count: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.selectComponent('.pop-box').show({
    // });
    var that = this;
    that.getDateInitList().then(function () {
      that.getBgCustomShare();
      that.getMapList();
    });
  },
  getBgCustomShare: function () {
    var that = this;
    app.https(app.api.bgCustomShareApi, {
      fromday: that.data.fromday,
    }, 'get').then(function (data) {
      data = data.data;
      that.setData({
        create_count: data.create_count || 0,
        voucher_send_count: data.voucher_send_count || 0,
        voucher_used_count: data.voucher_used_count || 0
      });
    });
  },
  getDateInitList: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      app.https(app.api.couponListInitApi, {
      }, 'get').then(function (data) {
        data = data.data;
        that.setData({
          range_date_group: data.list_day || [],
          fromday: data.list_day ? (data.list_day[0].id || '') : ''
        });
        resolve();
      });
    });
  },
  getMapList: function () {
    var that = this;
    var url = app.api.bgCustomShareMapApi;
    if (that.data.tabType == '2'){
      url = app.api.bgCustomSendMapApi;
    } else if (that.data.tabType == '3') {
      url = app.api.bgCustomUsedMapApi;
    }
    return new Promise(function (resolve, reject) {
      app.https(url, {
        fromday: that.data.fromday
      }, 'get').then(function (data) {
        data = data.data;
        resolve();
      });
    });
  },
  bindTabSelected: function (e) {
    this.setData({
      tabType: e.currentTarget.dataset.type
    });
    this.getMapList();
  },
  bindDataSelected: function(e){
    this.setData({
      fromday:e.detail
    });
    this.getBgCustomShare();
    this.getMapList();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }
})