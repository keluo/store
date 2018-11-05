// pages/promotion/coupon/add/add.js
import formValidate from '../../../../utils/formValidate';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount:'',
    floor_amount: '',
    voucer_valid:'1',
    voucer_valid_index:'0',
    voucer_valid_group: [
      { key: '1', value: '固定时间'},
      { key: '2', value: '相对时间' },
    ],
    time_rule: '',
    time_rule_checked:'',
    time_rule_group: [],
    day_rule: '',
    day_rule_index: '',
    day_rule_group: [],
    voucher_valid_after: '',
    voucher_valid_after_index: '',
    voucher_valid_after_group: [],
    voucher_quantity:'',
    voucher_quantity_index: '',
    voucher_quantity_group: [],
    now_date: app.utils.util.formatDate(new Date()),
    voucher_valid_end: app.utils.util.formatDate(new Date())
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getCatInitList();
    that.initValidate();
  },
  getCatInitList: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      app.https(app.api.couponCatInitApi, {
      }, 'get').then(function (data) {
        data = data.data;
        that.setData({
          time_rule_group: data.time_rules,
          time_rule: data.time_rules[0].key,
          time_rule_checked: data.time_rules[0].key,
          day_rule_group: data.day_rules,
          day_rule: data.day_rules[0].key,
          day_rule_index: 0,
          voucher_valid_after_group: data.valid_after_rules,
          voucher_valid_after: data.valid_after_rules[0].key,
          voucher_valid_after_index: 0,
          voucher_quantity_group: data.voucher_quantity_rules,
          voucher_quantity: data.voucher_quantity_rules[0].key,
          voucher_quantity_index: 0
        });
        resolve();
      });
    });
  },
  bindRadioChange: function (e) {
    this.setData({
      time_rule: e.detail.value
    });
  },
  bindPickerChange: function (e) {
    var type = e.currentTarget.dataset.type;
    if (type === 'expiry_date') {
      this.setData({
        voucer_valid: this.data.voucer_valid_group[e.detail.value].key,
        voucer_valid_index: e.detail.value
      })
    } else if (type === 'day_rule') {
      this.setData({
        day_rule: this.data.day_rule_group[e.detail.value].key,
        day_rule_index: e.detail.value
      })
    } else if (type === 'voucher_quantity') {
      this.setData({
        voucher_quantity: this.data.voucher_quantity_group[e.detail.value].key,
        voucher_quantity_index: e.detail.value
      })
    } else if (type === 'voucher_valid_after') {
      this.setData({
        voucher_valid_after: this.data.voucher_valid_after_group[e.detail.value].key,
        voucher_valid_after_index: e.detail.value
      })
    } else if (type === 'voucher_valid_end') {
      this.setData({
        voucher_valid_end: e.detail.value
      })
    }
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
    app.https(app.api.couponAddApi, {
      'amount': e.detail.value.amount,
      'floor_amount': e.detail.value.floor_amount,
      'voucer_valid': this.data.voucer_valid,
      'voucher_valid_end': this.data.voucher_valid_end,
      'voucher_quantity': this.data.voucher_quantity,
      'day_rule': this.data.day_rule,
      'time_rule': this.data.time_rule,
      'voucher_valid_after': this.data.voucher_valid_after,
    }, 'post').then(function (data) {
      wx.showToast({
        title: '发放成功',
        icon: 'success',
        mask: true
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
      amount: {
        required: true
      },
      floor_amount: {
        required: true,
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      amount: {
        required: '请输入优惠券面额'
      },
      floor_amount: {
        required: '输入最低消费额度',
      }
    }

    // 创建实例对象
    this.formValidate = new formValidate(rules, messages)
  }
  
})