// pages/promotion/statistics/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromday: '',
    range_date_group: [],
    sg_id: '',
    sg_group: [],
    share_count: 0,
    touch_count: 0,
    voucher_send_count: 0,
    voucher_used_count: 0,
    popInfoList:[
      {
        title:'推广人数',
        desc:'分享店铺推广海报的总人数。'
      },
      {
        title: '触达人数',
        desc: '看到过店铺推广海报并识别海报上领券二维码的人数。'
      },
      {
        title: '领券总数',
        desc: '通过识别店铺推广海报上的领券二维码成功领取的优惠券总数。'
      },
      {
        title: '核销总数',
        desc: '通过店铺推广海报上的领券二维码领取后到店核销的优惠券总数。'
      },{
        title: '微信触达用户',
        desc: '在微信内看到店铺推广海报并识别海报上二维码到达领券页面的用户。'
      }
    ],
    popInfoIndex: 0
  },
  bindShowPop:function(e){
    this.setData({
      popInfoIndex: e.currentTarget.dataset.index
    });
    this.selectComponent('.pop-box').show();
  },
  bindClosePop: function () {
    this.selectComponent('.pop-box').hide();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getSgInitList().then(function () {
      that.getDateInitList().then(function(){
        that.getSgCustomShare();
      });
    });
    that.selectComponent('.pop-box').init({
      close:false
    });

  },
  bindSgSelected: function(e){
    this.setData({
      sg_id: e.detail
    });
    this.getSgCustomShare();
  },
  bindDateSelected: function (e) {
    this.setData({
      fromday: e.detail
    });
    this.getSgCustomShare();
  },
  getSgCustomShare: function () {
    var that = this;
    app.https(app.api.sgCustomShareApi, {
      sg_id: that.data.sg_id,
      fromday: that.data.fromday,
    }, 'get').then(function (data) {
      data = data.data;
      that.setData({
        share_count: data.share_count || 0,
        touch_count: data.touch_count || 0,
        voucher_send_count: data.voucher_send_count || 0,
        voucher_used_count: data.voucher_used_count || 0
      });
    });
  },
  getSgInitList: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      app.https(app.api.queryAssetGroup, {
      }, 'get').then(function (data) {
        data = data.data;
        that.setData({
          sg_group: data.sgs || [],
          sg_id: data.sgs ? (data.sgs[0].id || '') : ''
        });
        resolve();
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