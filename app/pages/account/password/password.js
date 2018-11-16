// pages/account/password/password.js
import formValidate from '../../../utils/formValidate';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    valid:'',
    password: '',
    new_password: '',
    timmer: '',
    valid_disabled: false,
    valid_text: '获取验证码'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate();
  },
  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },
  bindGetValid: function () {
    if (this.data.phone && (/^1[3456789]\d{9}$/.test(this.data.phone))) {
      this.countDown(60);
      app.https(app.api.smsSendApi, {
        'username': this.data.phone
      }, 'post').then(function (data) {
        wx.showToast({
          title: data.msg,
          icon: 'none',
          mask: true
        });
      }).catch(function (data) {
        wx.showToast({
          title: data.msg,
          icon: 'none',
          mask: true
        });
      });
    } else {
      wx.showToast({
        title: "请输入手机号码",
        icon: 'none',
        mask: true
      });
    }
  },
  countDown: function (time) {
    var that = this;
    clearInterval(that.data.timmer);
    time = time || 60;
    that.setData({
      valid_disabled: true,
      valid_text: time + '秒后重发'
    });
    that.data.timmer = setInterval(function () {
      if (time < 2) {
        that.setData({
          valid_disabled: false,
          valid_text: '获取验证码'
        });
        clearInterval(that.data.timmer);
        return false;
      }
      time--
      that.setData({
        valid_text: time + '秒后重发'
      });
    }, 1000);
  },
  formSubmit: function (e) {
    var that = this;
    if (!this.formValidate.checkForm(e)) {
      const error = this.formValidate.errorList[0];
      wx.showToast({
        title: error.msg,
        icon: 'none',
        mask: true,
        duration: 1500,
      });
      return false;
    }
    app.https(app.api.forgotPasswordApi, {
      'username': e.detail.value.phone,
      'password': e.detail.value.valid,
      'newpassword': e.detail.value.password,
    }, 'post').then(function (data) {
      data = data.data;
      var token = wx.setStorageSync('user', "");
      wx.reLaunch({
        url: '/pages/account/login/login'
      });
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
      phone: {
        required: true,
        tel: true
      },
      valid: {
        required: true
      },
      password: {
        required: true,
        hasChinese: true,
        minlength: 6,
        maxlength: 12
      },
      new_password: {
        required: true,
        hasChinese: true,
        minlength: 6,
        maxlength: 12,
        equalTo: 'password'
      }
    }
    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      phone: {
        required: "请输入手机号",
        tel: "请输入正确的手机号"
      },
      valid: {
        required: "请输入验证码"
      },
      password: {
        required: "请输入新密码",
        minlength: "新密码为6-12位字符",
        maxlength: "新密码为6-12位字符",
        hasChinese: "确认密码不支持特殊字符"
      },
      new_password: {
        required: "请再次输入新密码",
        minlength: "确认密码为6-12位字符",
        maxlength: "确认密码为6-12位字符",
        equalTo: "两次输入的新密码不相同",
        hasChinese: "确认密码不支持特殊字符"
      }
    }
    // 创建实例对象
    this.formValidate = new formValidate(rules, messages)
  }
})