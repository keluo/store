// pages/user/password/reset.js
import formValidate from '../../../utils/formValidate';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    old_password: '',
    new_password: '',
    new_password_ext: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      username: wx.getStorageSync('user').username || ""
    });
    this.initValidate();
  },
  bindCancel:function(){
    wx.navigateBack({
      delta: 1
    })
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
    app.https(app.api.restPasswordApi, {
      'password': e.detail.value.old_password,
      'newpassword': e.detail.value.new_password,
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
      old_password: {
        required: true
      },
      new_password: {
        required: true,
        hasChinese: true,
        minlength: 6,
        maxlength: 12
      },
      new_password_ext: {
        required: true,
        hasChinese: true,
        minlength: 6,
        maxlength: 12,
        equalTo:'new_password'
      }
    }
    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      old_password: {
        required: "请填写旧密码"
      },
      new_password: {
        required: "请输入新密码",
        minlength: "新密码为6-12位字符",
        maxlength: "新密码为6-12位字符",
        hasChinese: "确认密码不支持特殊字符"
      },
      new_password_ext: {
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