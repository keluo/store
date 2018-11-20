// pages/promotion/statistics/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromday: '',
    range_date_group: [],
    state:'',
    state_group:[],
    wechat_user_list: [],
    total_count:0,
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
        desc: '优惠券领取成功后到店使用的总数。'
      },{
        title: '微信触达用户',
        desc: '在微信内看到店铺推广海报并识别海报上二维码到达领券页面的用户。'
      }
    ],
    popInfoIndex: 0,
    hasNotMore: true,
    isLoadingMore: false,
    page: 1,
    total: 0
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
        that.getWechatUserList();
      });
    });
    that.selectComponent('.pop-box').init({
      close:false
    });

  },
  getWechatUserList: function () {
    var that = this;
    app.https(app.api.wechatUserListApi, {
      sg_id: that.data.sg_id,
      fromday: that.data.fromday,
      state: that.data.state
    }, 'get').then(function (data) {
      data = data.data;
      let param = {
        wechat_user_list: data.was || [],
        total_count: data.total_count || 0
      };
      if (that.data.state_group.length == 0) {
        param['state_group'] = data.states || [];
        param['state'] = data.states ? (data.states[0].id || '') : '';
      }
      that.setData(param);
    });
  },
  bindStateSelected: function(e){
    this.setData({
      state: e.detail
    });
    this.getWechatUserList();
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
  },//回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      wechat_user_list: [],
      state: '',
      state_group: []
    });
    this.getWechatUserList();
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