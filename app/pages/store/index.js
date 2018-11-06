let https = require('../../service/https.js');
let { queryAssetGroup, dayList, exportInfo } = require('../../service/api.js');

// miniprogram/pages/store/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isActive: 0,
    params:{
      id: 2,
      name: '',
      begin_time: '',
      end_time: '',
    },
    dateList: [
      { id: 0, name: '今天'},
      { id: 1, name: '昨天' },
      { id: 6, name: '近7天' },
      { id: 14, name: '近15天' },
      { id: 29, name: '近30天' }
    ],
    selectArray: [],
    emailInputVal: '', 
    mailList:[
      {
        value: '12321321@qq.com',
        checked: false
      },
      {
        value: '12321321@qq.com',
        checked: false
      }
    ],
    emails: []
  },
  bindSelected: function(id){
    let name = this.data.selectArray.find((item) => {
      return item.id == id.detail
    }).name

    this.setData({
      ['params.id']: id.detail,
      ['params.name']: name
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ['params.begin_time']: this.fmtDate(new Date().setDate(new Date().getDate() - 6)),
      ['params.end_time']: this.fmtDate(new Date())
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getShopList();

    // try {
    //   let list = wx.getStorageSync('mailList')
    //   if (list) {
    //     this.setData({
    //       mailList: list
    //     })
    //   }
    // } catch (e) {
    //   console.log(e)
    // }
    
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

  },
  handleDownLoad () {
    this.selectComponent('.pop-box').show({

    });
  },
  isKeliu() {
    this.setData({
      isActive: 0
    })
  },
  isJindian() {
    this.setData({
      isActive: 1
    })
  },
  getShopList () {
    let that = this;
    // https(queryAssetGroup, {}, 'get').then(res => {
    //   console.log(res)
    // })
    wx.request({
      url: 'https://cloud1.ubiwifi.cn/etma/bg/cond/',
      header: {
        'Cookie': 'sessionid=wrplc2hgwjuz6xw8ke1xyvg6hbkadtb0;csrftoken=ArDz1UqvkrnWaDWjUNtCPube3QbREfiW;'
      },
      success (res) {
        that.setData({
          selectArray: res.data.data.bgs
        })
      }
    })
  },
  bindDateChange (e) {
    let currentId = this.data.dateList[e.detail.value].id;
    let begin = new Date().setDate(new Date().getDate() - currentId);
    let end = new Date();
    if (currentId == 1){
      end = new Date().setDate(new Date().getDate() - currentId)
    }
    this.setData({
      ['params.begin_time']: this.fmtDate(begin),
      ['params.end_time']: this.fmtDate(end)
    })
  },
  notToday (e) {
    let time = new Date().setDate(new Date().getDate() - 1);
    this.setData({
      ['params.begin_time']: this.fmtDate(time),
      ['params.end_time']: this.fmtDate(time)
    })
  },
  emailInput (e) {//input输入事件
    this.setData({
      emailInputVal: e.detail.value
    })
  },
  hadnleConfirm (e) {
    console.log(e)
    let subArr = this.data.emails;
    let regMail = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$');
    if (!regMail.test(e.detail.value)){
      wx.showToast({
        title: '邮箱格式错误',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    //通过验证 邮箱push到mailList 发到后台
    subArr.push(e.detail.value);
    https(exportInfo, {
      id: this.data.params.id,
      day_time: 'xxx',
      emails: subArr
    }, 'post').then(res => {
      console.log(res)
    })
  },
  radioChange(e) {//多选框事件
    this.setData({
      emails: e.detail.value
    })
  },
  selectAll () {
    let list = this.data.mailList;
    for(let i=0;i<list.length;i++){
      list[i].checked = true
    }
    this.setData({
      mailList: list
    })
  },
  handleSubMail () {
    let subArr = this.data.emails;
    let list = this.data.mailList;    
    let regMail = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$');

    if (this.data.emailInputVal) {
      if (regMail.test(this.data.emailInputVal)){
        subArr.push(this.data.emailInputVal);
        list.push({
          value: this.data.emailInputVal,
          checked: false
        })
      }else{
        wx.showToast({
          title: '邮箱格式错误',
          icon: 'loading',
          duration: 1500
        })
        return false;
      }
    }

    if (subArr.length > 0){
      https(exportInfo, {
        id: this.data.params.id,
        day_time: 'xxx',
        subArr: subArr
      }, 'post').then(res => {
        console.log(res)
      })
      
      for (let i = 0; i < list.length; i++) {
        list[i].checked = false
      }
      try {
        wx.setStorage({
          key: "mailList",
          data: list
        })
      } catch (e) {
        console.log(e)
      }
      this.selectComponent('.pop-box').hide({});
    }   
  },
  fmtDate (obj) {
    var date = new Date(obj);
    var y = 1900 + date.getYear();
    var m = "0" + (date.getMonth() + 1);
    var d = "0" + date.getDate();
    return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
  }
})