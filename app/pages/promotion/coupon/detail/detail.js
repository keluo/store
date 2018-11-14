// pages/promotion/coupon/detail/detail.js
import * as echarts from '../../../../pages/store/ec-canvas/echarts';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount:0,
    floor_amount: 0,
    valid_daytime:'',
    valid_period: '',
    send_total_count: 0,
    used_total_count: 0,
    vsdc: [],
    vudc: [],
    ec: {
      lazyLoad: true
    }
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
    that.ecComponnet = that.selectComponent('#mychart-dom');
    that.option = that.getOption();
    that.onEcInit();
    //that.chart.showLoading();
    that.getInitInfo().then(function (data) {
      that.onDrawEc(data);
    });
  },
  onDrawEc: function (data) {
    var that = this;
    var dateList = [];
    var vsdcList = [];
    var vudcList = [];
    data = data.temp_info;
    //data = { "send_total_count": 4, "vsdc": [{ "date": "11-13", "count": 2 }, { "date": "11-14", "count": 3 }, { "date": "11-15", "count": 4 }, { "date": "11-16", "count": 5 }], "vudc": [{ "date": "11-13", "count": 4 }, { "date": "11-14", "count": 5 }, { "date": "11-15", "count": 6 }, { "date": "11-16", "count": 7 }], "used_total_count": 0 };
    for (var i = 0; i < data.vsdc.length; i++) {
      dateList[i] = data.vsdc[i].date;
      vsdcList[i] = data.vsdc[i].count;
      vudcList[i] = data.vudc[i].count;
    }
    that.option.xAxis.data = dateList;
    that.option.series[0].data = vsdcList;
    that.option.series[1].data = vudcList;
    that.chart.setOption(that.option, true);
    that.chart.hideLoading();
  },
  onEcInit: function () {
    var that = this;
    that.ecComponnet.init(function (canvas, width, height) {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      chart.setOption(that.option);
      that.chart = chart;
      that.chart.showLoading();
      return chart;
    })
  },
  getInitInfo: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      app.https(app.api.couponAddApi, {
        id: that.data.id
      }, 'get').then(function (data) {
        data = data.data;
        that.setData({
          amount: data.amount || 0,
          floor_amount: data.floor_amount || 0,
          valid_period: data.valid_period || '',
          valid_daytime: data.valid_daytime || '',
          send_total_count: data.temp_info.send_total_count || 0,
          used_total_count: data.temp_info.used_total_count || 0
        });
        resolve(data);
      });
    });
  },
  getOption: function () {
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
        data: ['总领取数', '总核销数']
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
        formatter: function (params) {
          var res = '日期：' + (params[0]?params[0].axisValue : '');
          for (var i = 0; i < params.length; i++) {
            res += '\n' + params[i].seriesName + ' : ' + params[i].value + '张';
          }
          return res;
        }
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
        name: '总领取数',
        data: [0, 0, 0, 0, 0, 0, 0],
        type: 'line',
        showSymbol: false,
        smooth: true
      }, {
        name: '总核销数',
        data: [0, 0, 0, 0, 0, 0, 0],
        type: 'line',
        showSymbol: false,
        smooth: true
      }
      ]
    };
  }
})