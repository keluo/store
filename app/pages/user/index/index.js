// pages/user/index/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 
   */
  bindToPage:function(e){
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: e.currentTarget.dataset.url
    })
  },
  /**
   * 退出登录
   */
  bindLogout: function(){
    var that = this;
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          app.https(app.api.logoutApi, {
            'openid': wx.getStorageSync('openid')
          }, 'post').then(function (data) {
            wx.setStorageSync('user', '');
            wx.reLaunch({
              url: '/pages/account/login/login',
            });
          }).catch(function (data) {
            wx.showToast({
              title: data.msg,
              icon: 'none',
              duration: 2000,
              mask: true
            })
          });
        } else if (res.cancel) {
        }
      }
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