// pages/user/money/list/list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cat_id: '',
    cat_group:[{
      id:'',
      name: '全部'
    }, {
      id: '0',
      name: '充值'
    }, {
      id: '1',
      name: '分享返佣'
    }, {
      id: '2',
      name: '核销返佣'
    }],
    month: app.utils.util.formatMonth(new Date()),
    total_charge: '0.00',
    total_consume: '0.00',
    trade_list: [],
    hasNotMore: true,
    isLoadingMore: false,
    page: 1,
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTradeList();
  },
  bindToPage: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/user/money/detail/detail?id=' + id,
    });
  },
  bindCatSelected: function (e) {
    this.setData({
      cat_id: e.detail,
      page: 1,
      trade_list: []
    });
    this.getTradeList();
  },
  bindDateChange: function(e){
    this.setData({
      month: e.detail.value,
      page: 1,
      trade_list: []
    });
    this.getTradeList();
  },
  getTradeList: function(){
    var that = this;
    return new Promise(function (resolve, reject) {
      app.https(app.api.tradeListApi, {
        page: that.data.page,
        length: 10,
        month: that.data.month,
        trade_type: that.data.cat_id
      }, 'get').then(function (data) {
        data = data.data;
        var trade_list = that.data.trade_list.concat(data.trade_list || []);
        that.setData({
          trade_list: trade_list,
          total: data.total_count || 0,
          total_charge: data.total_charge || '0.00',
          total_consume: data.total_consume || '0.00',
          hasNotMore: trade_list.length === data.total_count,
          page: (trade_list.length === data.total_count) ? that.data.page : (that.data.page + 1)
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
      trade_list: []
    });
    this.getTradeList();
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 2000);
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
    that.getTradeList().then(function () {
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