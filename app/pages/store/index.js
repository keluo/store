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
      name: '',
      begin_time: '',
      end_time: '',
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
    console.log(id)
    let name = this.data.selectArray.find((item) => {
      return item.id == id.detail
    }).name

    this.setData({
      ['params.id']: id.detail,
      ['params.name']: name
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ['params.begin_time']: this.fmtDate(new Date().setDate(new Date().getDate() - 6)),
      ['params.end_time']: this.fmtDate(new Date())
    })
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
  handleDownLoad () {
    this.selectComponent('.pop-box').show({

    });
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
      url: 'https://cloud1.ubiwifi.cn/etma/bg/cond/',
      header: {
        'Cookie': 'sessionid=7vuhmcc1gx5psq9cgpo057o5bdtwc6bx;csrftoken=pgED9Ff6sIi1bGW3qDviEqZHbYU46010;'
      },
      success (res) {
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
  notToday: function(e) {
    console.log(e)
    let time = new Date().setDate(new Date().getDate() - 1);
    this.setData({
      ['params.begin_time']: this.fmtDate(time),
      ['params.end_time']: this.fmtDate(time)
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