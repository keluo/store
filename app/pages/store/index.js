let https = require('../../service/https.js');
let { queryAssetGroup } = require('../../service/api.js');

// miniprogram/pages/store/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isActive: 0,
    params:{
      id: 2,
      begin_time: '2018-09-15',
      end_time: '2018-10-15',
    },
    dateList: [
      { id: 0, name: '今天'},
      { id: 1, name: '昨天' },
      { id: 6, name: '近7天' },
      { id: 14, name: '近15天' },
      { id: 29, name: '近30天' }
    ],
    selectArray: []
  },
  bindSelected: function(id){
    this.setData({
      ['params.id']: id.detail
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getShopList();
    // wx.canvasToTempFilePath({
    //   x: 100,
    //   y: 200,
    //   width: 50,
    //   height: 50,
    //   destWidth: 100,
    //   destHeight: 100,
    //   canvasId: 'myCanvas',
    //   success(res) {
    //     console.log(res.tempFilePath)
    //   }
    // })
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

  },
  isKeliu() {
    this.setData({
      isActive: 0
    })
  },
  isJindian() {
    this.setData({
      isActive: 1
    })
  },
  getShopList () {
    let that = this;
    // https(queryAssetGroup, {}, 'get').then(res => {
    //   console.log(res)
    // })
    wx.request({
      url: 'https://mart.ubiwifi.cn/etma/bg/cond/',
      header: {
        'Cookie': 'sessionid=c74bef6dyxjsgjf5b0o9k8tme5bgzv8j;csrftoken=dUnBYhhayarzBDHAR1hDgXuLqu2ueGPt;'
      },
      success (res) {
        console.log(res)
        that.setData({
          selectArray: res.data.data.bgs
        })
      }
    })
  },
  bindDateChange: function (e) {
    let currentId = this.data.dateList[e.detail.value].id;
    let begin = new Date().setDate(new Date().getDate() - currentId);
    let end = new Date();
    if (currentId == 1){
      end = new Date().setDate(new Date().getDate() - currentId)
    }
    this.setData({
      ['params.begin_time']: this.fmtDate(begin),
      ['params.end_time']: this.fmtDate(end)
    })
  },
  fmtDate: function (obj) {
    var date = new Date(obj);
    var y = 1900 + date.getYear();
    var m = "0" + (date.getMonth() + 1);
    var d = "0" + date.getDate();
    return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
  }
})