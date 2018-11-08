// pages/user/qualifications/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    whole_address: '',
    contact_name: '',
    contact_link: '',
    cat_name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getInfo();
  },
  getInfo: function(){
    var that = this;
    return new Promise(function (resolve, reject) {
      app.https(app.api.bgInfoApi, {
      }, 'get').then(function (data) {
        data = data.data;
        that.setData({
          name: data.name || '',
          whole_address: data.whole_address || '',
          contact_name: data.contact_name || '',
          contact_link: data.contact_link || '',
          cat_name: data.cat_name || ''
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