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
      id: '',
      name: '',
      begin_time: '',
      end_time: '',
      day_time: '',
      selectShow: false
    },
    day_time: 0,
    dateList: [],
    selectArray: [],
    emailInputVal: '', 
    mailList:[],
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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getShopList();
    this.getDayList();

    try {
      let list = wx.getStorageSync('mailList')
      if (list) {
        this.setData({
          mailList: list
        })
      }
    } catch (e) {
      console.log(e)
    }
    
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
  selectShow (e) {
    this.setData({
      ['params.selectShow']: true
    })
  },
  selectHide (e) {
    this.setData({
      ['params.selectShow']: false
    })
  },
  handleDownLoad () {
    let that = this;
    this.selectComponent('.pop-box').init({
      showCallback () {
        that.setData({
          ['params.selectShow']: true
        })
      },
      hideCallback () {
        that.setData({
          ['params.selectShow']: false
        })
      }
    }).show({});
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
  isGuke() {
    wx.showToast({
      title: '请联系客服开通',
      image: '../../images/store/smile.png'
    })
  },
  getShopList () {
    https(queryAssetGroup, {}, 'get').then(res => {
      let arr = []
      for(let i=0;i<res.data.sgs.length;i++){
        arr.push({
          id: res.data.sgs[i].id,
          name: res.data.sgs[i].place_name
        })
      }
      this.setData({
        selectArray: arr,
        ['params.id']: res.data.sgs[0] ? (res.data.sgs[0].id ? res.data.sgs[0].id: '' ) : '',
        ['params.name']: res.data.sgs[0] ? (res.data.sgs[0].place_name ? res.data.sgs[0].place_name : '请选择') : '请选择'
      })
    })
  },
  getDayList () {// 获取时间列表
    https(dayList, {}, 'get').then(res => {
      let data = res.data;
      this.setData({
        dateList: res.data,
        ['params.begin_time']: data[2] ? (data[2].begin_time ? data[2].begin_time : '') : '' ,
        ['params.end_time']: data[2] ? (data[2].end_time ? data[2].end_time : '') : '',
        ['params.day_time']: data[2] ? (data[2].id ? data[2].id : '') : ''
      })
    })
  },
  bindDateChange (e) {
    let obj = this.data.dateList[e.detail.value]
    this.setData({
      ['params.begin_time']: obj.begin_time,
      ['params.end_time']: obj.end_time,
      ['params.day_time']: obj.id,
      day_time: e.detail.value
    })
  },
  notToday (e) {
    let time = this.data.dateList[1];
    this.setData({
      ['params.begin_time']:time.begin_time,
      ['params.end_time']: time.end_time,
      ['params.day_time']: time.id
    })
  },
  emailInput (e) {//input输入事件
    this.setData({
      emailInputVal: e.detail.value
    })
  },
  radioChange(e) {//多选框事件
    this.setData({
      emails: e.detail.value
    })
  },
  selectAll () {
    let list = this.data.mailList;
    let subList = [];
    for(let i=0;i<list.length;i++){
      list[i].checked = true,
      subList.push(list[i].value)
    }
    this.setData({
      mailList: list,
      emails: subList
    })
  },
  handleSubMail () {
    let subArr = this.data.emails;// 多选框选中的email
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
          icon: 'none',
          duration: 1500
        })
        return false;
      }
    }

    // 邮箱去重
    let hash = {};
    list = list.reduce(function (item, next) {
      hash[next.value] ? '' : hash[next.value] = true && item.push(next);
      return item
    }, [])

    if (subArr.length > 0){
      https(exportInfo, {
        id: this.data.params.id,
        day_time: this.data.day_time,
        emails: subArr
      }, 'get').then(res => {
        console.log(res)
        if(res.code === "1"){
          wx.showToast({
            title: '发送成功',
            duration: 1500
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
        }else{
          wx.showToast({
            title: '发送失败',
            icon: 'none',
            duration: 1500
          })
        }
      })    
    }else{
      wx.showToast({
        title: '请选择邮箱',
        icon: 'none',
        duration: 1500
      })
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