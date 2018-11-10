// pages/user/index/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    whole_address:'',
    contact_name:'',
    now_fee:0,
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
    var that = this;
    that.getInfo();
  },
  getInfo: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      app.https(app.api.bgInfoApi, {
      }, 'get').then(function (data) {
        data = data.data;
        that.setData({
          whole_address: data.whole_address || '',
          contact_name: data.contact_name || '',
          now_fee: data.now_fee || 0
        });
        resolve();
      });
    });
  }
})