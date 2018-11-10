// pages/promotion/index/index.js
var QRCode = require('../../../utils/qrcode.js')
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabType:'1',
    range_date_group: [],
    fromday: '',
    create_count: 0,
    voucher_send_count: 0,
    voucher_used_count: 0,
    qrcodeImg: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.selectComponent('.pop-box').show({
    // });
    var that = this;
    that.getDateInitList().then(function () {
      that.getBgCustomShare();
      that.getMapList();
    });
  },
  bindToPage: function () {
    var that = this;
    this.checkAuth().then(function(){
      wx.navigateTo({
        url: "/pages/promotion/coupon/list/list"
      })
    }).catch(function (url) {
      console.log(url); 
      //传入wxml中二维码canvas的canvas-id
      var qrcode = new QRCode('canvasid', {
        // usingIn: this,
        text: url,
        width: 150,
        height: 150,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.L,
      });
      qrcode.makeImage();
      qrcode.exportImage(function(url){
        that.setData({
          qrcodeImg: url
        });
      });
      that.selectComponent('.pop-qrcode').show({
      });
    });
  },
  saveImg: function (e) {
    var that = this;
    console.log("长按");
    wx.getSetting({
      success: function (res) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: function (res) {
            console.log("授权成功");
            var imgUrl = that.data.qrcodeImg;//图片地址
            wx.downloadFile({//下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
              url: imgUrl,
              success: function (res) {
                console.log(res);
                // 下载成功后再保存到本地
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,//返回的临时文件路径，下载后的文件会存储到一个临时文件
                  success: function (res) {
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  checkAuth: function(){
    var that = this;
    return new Promise(function (resolve, reject) {
      app.https(app.api.authCheckApi, {
      }, 'get').then(function (data) {
        data = data.data;
        if (data.status == '2') {
          reject(data.auth_url);
        } else {
          resolve();
        }
      });
    });
  },
  getBgCustomShare: function () {
    var that = this;
    app.https(app.api.bgCustomShareApi, {
      fromday: that.data.fromday,
    }, 'get').then(function (data) {
      data = data.data;
      that.setData({
        create_count: data.create_count || 0,
        voucher_send_count: data.voucher_send_count || 0,
        voucher_used_count: data.voucher_used_count || 0
      });
    });
  },
  getDateInitList: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      app.https(app.api.couponListInitApi, {
      }, 'get').then(function (data) {
        data = data.data;
        that.setData({
          range_date_group: data.list_day || [],
          fromday: data.list_day ? (data.list_day[0].id || '') : ''
        });
        resolve();
      });
    });
  },
  getMapList: function () {
    var that = this;
    var url = app.api.bgCustomShareMapApi;
    if (that.data.tabType == '2'){
      url = app.api.bgCustomSendMapApi;
    } else if (that.data.tabType == '3') {
      url = app.api.bgCustomUsedMapApi;
    }
    return new Promise(function (resolve, reject) {
      app.https(url, {
        fromday: that.data.fromday
      }, 'get').then(function (data) {
        data = data.data;
        resolve();
      });
    });
  },
  bindTabSelected: function (e) {
    this.setData({
      tabType: e.currentTarget.dataset.type
    });
    this.getMapList();
  },
  bindDataSelected: function(e){
    this.setData({
      fromday:e.detail
    });
    this.getBgCustomShare();
    this.getMapList();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }
})