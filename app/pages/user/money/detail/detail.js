// pages/user/money/detail/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    amount: 0,
    trade_type_name:'',
    timestamp:'',
    transaction_number:'',
    extend_alipay_id:'',
    consume_alipay_id:'',
    account_balance:'',
    recharge_method:'',
    trade_type:''//0:充值 1:核销 2:分享
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
    that.getDetailInfo();
  },
  getDetailInfo: function(){
    var that = this;
    return new Promise(function (resolve, reject) {
      app.https(app.api.tradeDetailApi, {
        id: that.data.id
      }, 'get').then(function (data) {
        data = data.data;
        that.setData({
          amount: data.amount || 0,
          trade_type_name: data.trade_type_name,
          timestamp: data.timestamp,
          transaction_number: data.transaction_number,
          extend_alipay_id: data.extend_alipay_id,
          consume_alipay_id: data.consume_alipay_id,
          account_balance: data.account_balance || 0,
          recharge_method: data.recharge_method,
          trade_type: data.trade_type
        });
        resolve();
      });
    });
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