// pages/promotion/coupon/add/add.js
import formValidate from '../../../../utils/formValidate';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    amount:'',
    floor_amount: '',
    voucer_valid:'2',
    voucer_valid_index:'1',
    voucer_valid_group: [
      { id: '1', name: '固定时间'},
      { id: '2', name: '相对时间' },
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
    var id = options.id || '';
    that.setData({
      id: id
    });
    that.getCatInitList().then(function(){
      if (id){
        that.getInitinfo();
      }
    });
    that.initValidate();
  },
  getIndexForKey: function (list, key, keyForValue) {
    if (!list || !key || !keyForValue) {
      return '';
    }
    var result = '';
    list.forEach(function (item, index) {
      if (item[key] == keyForValue) {
        result = index;
        return;
      }
    });
    return result;
  },
  getInitinfo: function(){
    var that = this;
    return new Promise(function (resolve, reject) {
      app.https(app.api.couponCopyApi, {
        id: that.data.id
      }, 'get').then(function (data) {
        data = data.data;
        that.setData({
          amount: data.amount || '',
          floor_amount: data.floor_amount || '',
          voucer_valid: data.voucer_valid || '',
          voucer_valid_index: that.getIndexForKey(that.data.voucer_valid_group, 'id', data.voucer_valid),
          voucher_valid_after: data.voucher_valid_after || '',
          voucher_valid_after_index: that.getIndexForKey(that.data.voucher_valid_after_group, 'id', data.voucher_valid_after),
          voucher_valid_end: data.voucher_valid_end || app.utils.util.formatDate(new Date()),
          day_rule: data.day_rule || '',
          day_rule_index: that.getIndexForKey(that.data.day_rule_group, 'id', data.day_rule),
          time_rule_checked: data.time_rule,
          time_rule: data.time_rule,
          voucher_quantity: data.voucher_quantity,
          voucher_quantity_index: that.getIndexForKey(that.data.voucher_quantity_group, 'id', data.voucher_quantity)
        });
        resolve();
      });
    });
  },
  getCatInitList: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      app.https(app.api.couponAddInitApi, {
      }, 'get').then(function (data) {
        data = data.data;
        that.setData({
          time_rule_group: data.time_rules,
          time_rule: data.time_rules[0].id,
          time_rule_checked: data.time_rules[0].id,
          day_rule_group: data.day_rules,
          day_rule: data.day_rules[0].id,
          day_rule_index: 0,
          voucher_valid_after_group: data.valid_after_rules,
          voucher_valid_after: data.valid_after_rules[0].id,
          voucher_valid_after_index: 0,
          voucher_quantity_group: data.voucher_quantity_rules,
          voucher_quantity: data.voucher_quantity_rules[0].id,
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
        voucer_valid: this.data.voucer_valid_group[e.detail.value].id,
        voucer_valid_index: e.detail.value
      })
    } else if (type === 'day_rule') {
      this.setData({
        day_rule: this.data.day_rule_group[e.detail.value].id,
        day_rule_index: e.detail.value
      })
    } else if (type === 'voucher_quantity') {
      this.setData({
        voucher_quantity: this.data.voucher_quantity_group[e.detail.value].id,
        voucher_quantity_index: e.detail.value
      })
    } else if (type === 'voucher_valid_after') {
      this.setData({
        voucher_valid_after: this.data.voucher_valid_after_group[e.detail.value].id,
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
      setTimeout(function(){
        wx.navigateBack({
          delta: 1
        })
      },1500);
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