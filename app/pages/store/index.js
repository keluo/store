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
      begin_time: '2018-10-15',
      end_time: '2018-10-15',
    },
    selectArray: []
  },
  bindSelected: function(id){
    console.log(id)
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
        'Cookie': 'sessionid=yb8ve9viavrn8px20eljsfogi9dhk2ug;csrftoken=jSo8hOwNiYxZsvHEYyCs6E2sqa3tMe87;'
      },
      success (res) {
        console.log(res)
        that.setData({
          selectArray: res.data.data.bgs
        })
      }
    })
  }
})