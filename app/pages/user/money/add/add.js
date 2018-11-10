// pages/user/money/add/add.js
import md5 from '../../../../utils/md5';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  formSubmit: function (e) {
    var that = this;
    if (e.detail.value.fee && e.detail.value.fee >= 1){
      app.https(app.api.payApi, {
        'cat': '2',
        'fee': e.detail.value.fee,
        'openid': wx.getStorageSync('openid')
      }, 'post').then(function (data) {
        data = data.data;
        var timeStamp = data.timeStamp + '',
          nonceStr = data.nonceStr,
          _package = data.package,
          appid = data.appId,
          paySign = '',
          str = '';
        str = 'appId=' + appid + '&nonceStr=' + nonceStr + '&package=' + _package + '&signType=MD5&timeStamp=' + timeStamp + '&key=yingnaubiwifi097531ubiwifiyingna';
        paySign = md5(str);
        wx.requestPayment({
          timeStamp: timeStamp,
          nonceStr: nonceStr,
          package: _package,
          signType: 'MD5',
          paySign: paySign,
          success(res) {
            console.log(res);
            if (res.errMsg && res.errMsg == 'requestPayment:ok') {
              wx.showToast({
                title: '充值成功',
                icon: 'success',
                mask: true
              });
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500);
            }
          },
          fail(res) {
            wx.showToast({
              title: '充值失败',
              icon: 'success',
              mask: true
            });
          }
        })
      }).catch(function (data) {
        wx.showToast({
          title: data.msg,
          icon: 'none',
          mask: true
        });
      });
    } else {
      wx.showToast({
        title: '充值金额须大于1元',
        icon: 'none',
        mask: true
      });
    }
  }
})