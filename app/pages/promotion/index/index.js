// pages/promotion/index/index.js
var QRCode = require('../../../utils/qrcode.js');
import * as echarts from '../../../pages/store/ec-canvas/echarts';
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canvensHide:false,
    tabType:'2',
    range_date_group: [],
    fromday: '',
    create_count: 0,
    voucher_send_count: 0,
    voucher_used_count: 0,
    qrcode:'',
    qrcodeImg: '',
    ecCreate: {
      lazyLoad: true
    },
    ecSend: {
      lazyLoad: true
    },
    ecUsed: {
      lazyLoad: true
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.ecCreateComponnet = that.selectComponent('#mychart-dom-multi-create');
    that.optionCreate = that.getOption();
    that.ecSendComponnet = that.selectComponent('#mychart-dom-multi-send');
    that.optionSend = that.getOption();
    that.ecUsedComponnet = that.selectComponent('#mychart-dom-multi-used');
    that.optionUsed = that.getOption();
    that.onCreateEcInit();
    that.onSendEcInit();
    that.onUsedEcInit();
    that.getDateInitList().then(function () {
      that.getBgCustomShare();
      that.getMapList().then(function (data) {
        that.onDrawEc(data);
      });
    });
  },
  onDrawEc: function (data) {
    var that = this;
    var dateList = [];
    var countList = [];
    if (that.data.tabType == '1') {
      data = data.data;
      for (var i = 0; i < data.length; i++) {
        dateList[i] = data[i].date;
        countList[i] = data[i].count;
      }
      that.optionCreate.xAxis.data = dateList;
      that.optionCreate.series[0].data = countList;
      that.createChart.setOption(that.optionCreate, true);
    } else if (that.data.tabType == '2') {
      data = data.data.vsdc.vsdc;
      for (var i = 0; i < data.length; i++) {
        dateList[i] = data[i].date;
        countList[i] = data[i].count;
      }
      that.optionSend.xAxis.data = dateList;
      that.optionSend.series[0].data = countList;
      that.sendChart.setOption(that.optionSend, true);
    } else if (that.data.tabType == '3') {
      data = data.data.vudc.vudc;
      for (var i = 0; i < data.length; i++) {
        dateList[i] = data[i].date;
        countList[i] = data[i].count;
      }
      that.optionUsed.xAxis.data = dateList;
      that.optionUsed.series[0].data = countList;
      that.usedChart.setOption(that.optionUsed, true);
    }
    that.createChart.hideLoading();
    that.sendChart.hideLoading();
    that.usedChart.hideLoading();
  },
  onCreateEcInit: function () {
    var that = this;
    that.ecCreateComponnet.init(function (canvas, width, height){
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      chart.setOption(that.optionCreate);
      that.createChart = chart;
      return chart;
    })
  },
  onSendEcInit: function () {
    var that = this;
    that.ecSendComponnet.init(function (canvas, width, height) {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      chart.setOption(that.optionSend);
      that.sendChart = chart;
      return chart;
    })
  },
  onUsedEcInit: function () {
    var that = this;
    that.ecUsedComponnet.init(function (canvas, width, height) {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      chart.setOption(that.optionUsed);
      that.usedChart = chart;
      return chart;
    })
  },
  bindToPage: function (e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    this.checkAuth().then(function(){
      wx.navigateTo({
        url: url
      })
    }).catch(function (url) {
      that.qrcodeCreate(url);
    });
  },
  qrcodeCreate: function (url) {
    var that = this;
    //传入wxml中二维码canvas的canvas-id
    if (!that.data.qrcode){
      that.data.qrcode = new QRCode('canvasid', {
        // usingIn: this,
        text: url,
        width: 150,
        height: 150,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.L,
      });
      setTimeout(function () {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          canvasId: 'canvasid',
          success: function (res) {
            let shareImg = res.tempFilePath;
            that.setData({
              qrcodeImg: shareImg
            })
          },
          fail: function (res) {
          }
        })
      }, 500);
    }
    that.selectComponent('.pop-qrcode').init({
      showCallback: function () {
        that.triggerCanvensHide();
      },
      hideCallback: function () {
        that.triggerCanvensHide();
      }
    }).selectComponent('.pop-qrcode').show();
  },
  saveImg: function (e) {
    var that = this;
    wx.getSetting({
      success: function (res) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: function (res) {
            var imgUrl = that.data.qrcodeImg;
            console.log(imgUrl)
            wx.saveImageToPhotosAlbum({
              filePath: imgUrl,
              success(res) {
                that.selectComponent('.pop-qrcode').hide(function () {
                  that.setData({
                    canvensHide: false
                  });
                  wx.showToast({
                    title: '保存二维码成功，请在相册中查看',
                    icon: 'none',
                    mask: true,
                    duration: 1500,
                  });
                });
              },
              fail(res) {
                console.log(res.errMsg)
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
        if (data.status == '1') {
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
    that.createChart.showLoading();
    that.sendChart.showLoading();
    that.usedChart.showLoading();
    if (that.data.tabType == '2'){
      url = app.api.bgCustomSendMapApi;
    } else if (that.data.tabType == '3') {
      url = app.api.bgCustomUsedMapApi;
    }
    return new Promise(function (resolve, reject) {
      app.https(url, {
        fromday: that.data.fromday
      }, 'get').then(function (data) {
        resolve(data);
      });
    });
  },
  bindTabSelected: function (e) {
    var that = this;
    that.setData({
      tabType: e.currentTarget.dataset.type
    });
    that.getMapList().then(function (data) {
      that.onDrawEc(data);
    });
  },
  bindDataSelected: function(e){
    var that = this;
    that.setData({
      fromday:e.detail
    });
    that.getBgCustomShare();
    that.getMapList().then(function (data) {
      that.onDrawEc(data);
    });
  },
  triggerCanvensHide: function(){
    var that = this;
    that.setData({
      canvensHide: !that.data.canvensHide
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getOption: function() {
    return {
      color: ['#0386E5', '#FF3C24', '#FFA602'],
      xAxis: {
        type: 'category',
        data: [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        name: '',
        nameTextStyle: {
          color: '#999',
          fontSize: 10
        },
        nameLocation: 'middle',
        axisLine: {
          show: false
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#999',
            fontSize: 10
          }
        }
      },
      legend: {
        bottom: 0,
        data: []
      },
      grid: {
        top: 20,
        right: 0
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'line',        // 默认为直线，可选为：'line' | 'shadow'
        },
        position: function (pos, params, dom, rect, size) {
          // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
          var obj = { top: 60 };
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
          return obj;
        },
        formatter: '{b}\n{a}：{c}人'
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            color: '#F9FAFE'
          }
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#999',
            fontSize: 10
          }
        },
        minInterval: 1
      },
      series: [{
        name: '',
        data: [0, 0, 0, 0, 0, 0, 0],
        type: 'line',
        showSymbol: false,
        smooth: true
      }
      ]
    };
  }
})