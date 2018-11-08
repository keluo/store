// pages/promotion/commission/seting.js
import formValidate from '../../../utils/formValidate';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share_commi:'0.1',
    voucher_commi:'1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate();
    this.getInit();
  },
  getInit: function(){
    var that = this;
    app.https(app.api.commiSettingApi, {
    }, 'get').then(function (data) {
      data = data.data;
      that.setData({
        share_commi: data.share_commi || '0.1',
        voucher_commi: data.voucher_commi || '1',
      });
    }).catch(function (data) {
      wx.showToast({
        title: data.msg,
        icon: 'none',
        mask: true
      });
    });
  },
  formatCommiShare: function(e){
    this.setData({
      share_commi: this.formatCommi(e.detail.value)
    });
  },
  formatCommiVoucher: function (e) {
    this.setData({
      voucher_commi: this.formatCommi(e.detail.value)
    });
  },
  formatCommi: function(value) {
    value = value + '';
    var re = /([0-9]+.[0-9]{2})[0-9]*/;
    value = value.replace(re, "$1");
    return value
  },
  formSubmit: function (e) {
    var that = this;
    if (!this.formValidate.checkForm(e)) {
      const error = this.formValidate.errorList[0];
      wx.showToast({
        title: error.msg,
        icon: 'none',
        mask: true,
        image: '../../../images/icon/tip.png',
        duration: 1500,
      });
      return false;
    }
    app.https(app.api.commiSettingApi, {
      'share_commi': e.detail.value.share_commi,
      'voucher_commi': e.detail.value.voucher_commi
    }, 'post').then(function (data) {
      wx.showToast({
        title: '设置成功',
        icon: 'success',
        mask: true
      });
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 1500);
    }).catch(function (data) {
      wx.showToast({
        title: data.msg,
        icon: 'none',
        mask: true
      });
    });
  },
  /**
   * 初始化校验规则
   */
  initValidate: function () {
    const rules = {
      share_commi: {
        required: true,
        number: true,
        min: 0.1
      },
      voucher_commi: {
        required: true,
        number: true,
        min: 1
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      share_commi: {
        required: '请输入分享反佣',
        min:'分享反佣>=0.1'
      },
      voucher_commi: {
        required: '请输入核销反佣',
        min: '核销反佣>=1'
      }
    }

    // 创建实例对象
    this.formValidate = new formValidate(rules, messages)
  }
})