// pages/account/login/login.js
import formValidate from '../../../utils/formValidate';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    method: '1',
    username:'',
    phone:'',
    password: '',
    timmer:'',
    valid_disabled:false,
    valid_text:'获取验证码',
    isPassword:true
  },
  bindSwitchPassword: function(){
    this.setData({
      isPassword: !this.data.isPassword
    });
  },
  inputPhone:function(e){
    this.setData({
      phone: e.detail.value
    });
  },
  bindGetValid: function(){
    if (this.data.phone){
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
  countDown: function(time){
    var that = this;
    clearInterval(that.data.timmer);
    time = time || 60;
    that.setData({
      valid_disabled:true,
      valid_text: time + '秒后重新发送'
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
        valid_text: time + '秒后重新发送'
      });
    }, 1000);
  },
  bindMethodSelected: function (e) {
    this.setData({
      method: this.data.method === '1' ? '3' : '1'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.initValidate();
  },
  formSubmit: function (e) {
    var that = this;
    if (this.data.method == '1'){
      if (!this.formValidateForUser.checkForm(e)) {
        const error = this.formValidateForUser.errorList[0];
        wx.showToast({
          title: error.msg,
          icon: 'none',
          mask: true,
          duration: 1500,
        });
        return false;
      }
    }
    if (this.data.method == '3') {
      if (!this.formValidateForPhone.checkForm(e)) {
        const error = this.formValidateForPhone.errorList[0];
        wx.showToast({
          title: error.msg,
          icon: 'none',
          mask: true,
          duration: 1500,
        });
        return false;
      }
    } 
    app.https(app.api.loginApi, {
      'username': this.data.method == '1' ? e.detail.value.username : e.detail.value.phone,
      'password': e.detail.value.password,
      'usertype': this.data.method,
      'openid': wx.getStorageSync('openid') 
    }, 'post').then(function (data) {
      data = data.data;
      var token = wx.setStorageSync('user', {
        token: data.token || '',
        market_role: data.market_role || '',
        username: data.username
      });
      wx.switchTab({
        url: '/pages/promotion/index/index'
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
    const rules_phone = {
      phone: {
        required: true,
        tel:true
      },
      password: {
        required: true
      }
    }
    // 验证字段的提示信息，若不传则调用默认的信息
    const messages_phone = {
      phone: {
        required: '请输入手机号码',
        tel:'请输入正确的手机号码'
      },
      password: {
        required: '请输入验证码'
      }
    }

    // 创建实例对象
    this.formValidateForPhone = new formValidate(rules_phone, messages_phone);

    const rules_user = {
      username: {
        required: true,
      },
      password: {
        required: true
      }
    }
    // 验证字段的提示信息，若不传则调用默认的信息
    const messages_user = {
      username: {
        required: '请输入登录账号',
      },
      password: {
        required: '请输入登录密码'
      }
    }
    this.formValidateForUser = new formValidate(rules_user, messages_user);
  }
})