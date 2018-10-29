// pages/promotion/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabType:'1',
    dateId:'',
    selectArray: [{
        "id": "7",
        "name": "近7天"
      }, {
        "id": "15",
        "name": "近15天"
      }, {
        "id": "30",
        "name": "近30天"
      }, {
        "id": "90",
        "name": "近90天"
      }, {
        "id": "180",
        "name": "近180天"
      }
    ]
  },
  bindTabSelected: function (e) {
    this.setData({
      tabType: e.currentTarget.dataset.type
    });
  },
  bindDateSelected: function(id){
    this.setData({
      dateId:id
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectComponent('.pop-box').show({
      
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