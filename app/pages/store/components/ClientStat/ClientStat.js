import * as echarts from '../../ec-canvas/echarts';

let https = require('../../../../service/https.js');
let { keLiuAllTotalAjax, totalCustomerAjax, keLiuDayAjax, jinDianDayAjax, newCustomerAjax } = require('../../../../service/api.js');

let chart = null;
let option = {
  color: ['#0386E5', '#FF3C24', '#FFA602'],
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  legend: {
    bottom: 0,
    data: ['星巴克新街口店']
  },
  grid: {
    top: 20
  },
  tooltip: {
    trigger: 'axis',
    formatter: "{b} {a}:{c}",
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'line',        // 默认为直线，可选为：'line' | 'shadow'
    },
    position: function (pos, params, dom, rect, size) {
      // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
      var obj = { top: 60 };
      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
      return obj;
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: false
    }
  },
  series: [{
    name: '星巴克新街口店',
    data: [820, 932, 901, 934, 1290, 1330, 1320],
    type: 'line',
    smooth: true
  }]
};

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  chart.setOption(option);
  return chart;
}

// pages/store/components/ClientStat/ClientStat.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    params:{
      type: Object,
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
        
        this.getTotalInfo();
        
        setTimeout(() => {
          this.isKeliu();
        }, 1000)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    isActive: 0,
    keLiu_total: 0,
    jinDian_total: 0,
    totalNewCustomer: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getTotalInfo () {
      //获取客流量、进店客
      https(keLiuAllTotalAjax, this.data.params, 'get').then(res => {
        if (res.code === "1") {
          this.setData({
            keLiu_total: res.data.ke_liu,
            jinDian_total: res.data.ru_dian
          })
        }
      })
      //获取新顾客
      https(totalCustomerAjax, this.data.params, 'get').then(res => {
        if (res.code === "1") {
          this.setData({
            totalNewCustomer: res.data.data.totalNewCustomer
          })
        }
      })
    },
    isKeliu() {
      this.setData({
        isActive: 0
      })
      chart.showLoading('default', {
        text: '',
        color: '#5b9bd1',
      });
      https(keLiuDayAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          let myList = res.data.data;

          option.xAxis.data = [];
          option.series[0].data = [];
          //查一天
          if (this.data.params.begin_time == this.data.params.end_time) {
            for (var i = 0; i < 24; i++) {
              var time = new Date(res.data.begin_time);
              time = time.setHours(time.getHours() + i);

              option.xAxis.data[i] = this.fmtMin(time);
              option.series[0].data[i] = 0;
              for (var j = 0; j < myList.length; j++) {
                if (this.fmtMin(time) == myList[j].HourTime.slice(11, 16)) {
                  option.series[0].data[i] = myList[j].ke_liu;
                }
              }

            }
            chart.hideLoading();
            chart.setOption(option, true);
          } else {
            // 不是同一天
            var days = (new Date(this.data.params.end_time).getTime() - new Date(this.data.params.begin_time).getTime()) / (1000 * 60 * 60 * 24);
            days = Math.floor(days) + 1;

            for (var i = 0; i < days; i++) {
              var time = this.fmtDate(new Date(this.data.params.begin_time).setDate(new Date(this.data.params.begin_time).getDate() + i));
              option.xAxis.data[i] = time;
              option.series[0].data[i] = 0;
              for (var j = 0; j < myList.length; j++) {
                if (time == myList[j].DayTime.slice(0, 10)) {
                  option.series[0].data[i] = myList[j].ke_liu;
                }
              }
            }
            chart.hideLoading();
            chart.setOption(option, true);
          }
        }

      })
    },
    isJindian() {
      this.setData({
        isActive: 1
      })
      chart.showLoading('default', {
        text: '',
        color: '#5b9bd1',
      });
      https(jinDianDayAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          let myList = res.data.data;

          option.xAxis.data = [];
          option.series[0].data = [];
          //查一天
          if (this.data.params.begin_time == this.data.params.end_time) {
            for (var i = 0; i < 24; i++) {
              var time = new Date(res.data.begin_time);
              time = time.setHours(time.getHours() + i);

              option.xAxis.data[i] = this.fmtMin(time);
              option.series[0].data[i] = 0;
              for (var j = 0; j < myList.length; j++) {
                if (this.fmtMin(time) == myList[j].HourTime.slice(11, 16)) {
                  option.series[0].data[i] = myList[j].jin_dian;
                }
              }

            }
            chart.hideLoading();
            chart.setOption(option, true);
          } else {
            // 不是同一天
            var days = (new Date(this.data.params.end_time).getTime() - new Date(this.data.params.begin_time).getTime()) / (1000 * 60 * 60 * 24);
            days = Math.floor(days) + 1;

            for (var i = 0; i < days; i++) {
              var time = this.fmtDate(new Date(this.data.params.begin_time).setDate(new Date(this.data.params.begin_time).getDate() + i));
              option.xAxis.data[i] = time;
              option.series[0].data[i] = 0;
              for (var j = 0; j < myList.length; j++) {
                if (time == myList[j].DayTime.slice(0, 10)) {
                  option.series[0].data[i] = myList[j].jin_dian;
                }
              }
            }
            chart.hideLoading();
            chart.setOption(option, true);
          }
        }
      })
    },
    isXinke() {
      this.setData({
        isActive: 2
      })
      chart.showLoading('default', {
        text: '',
        color: '#5b9bd1',
      });
      https(newCustomerAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          let myList = res.data.data;

          option.xAxis.data = [];
          option.series[0].data = [];
          //查一天
          if (this.data.params.begin_time == this.data.params.end_time) {
            for (var i = 0; i < 24; i++) {
              var time = new Date(res.data.begin_time);
              time = time.setHours(time.getHours() + i);

              option.xAxis.data[i] = this.fmtMin(time);
              option.series[0].data[i] = 0;
              for (var j = 0; j < myList.length; j++) {
                if (this.fmtMin(time) == myList[j].HourTime.slice(11, 16)) {
                  option.series[0].data[i] = myList[j].new_customers;
                }
              }

            }
            chart.hideLoading();
            chart.setOption(option, true);
          } else {
            // 不是同一天
            var days = (new Date(this.data.params.end_time).getTime() - new Date(this.data.params.begin_time).getTime()) / (1000 * 60 * 60 * 24);
            days = Math.floor(days) + 1;

            for (var i = 0; i < days; i++) {
              var time = this.fmtDate(new Date(this.data.params.begin_time).setDate(new Date(this.data.params.begin_time).getDate() + i));
              option.xAxis.data[i] = time;
              option.series[0].data[i] = 0;
              for (var j = 0; j < myList.length; j++) {
                if (time == myList[j].DayTime.slice(0, 10)) {
                  option.series[0].data[i] = myList[j].new_customers;
                }
              }
            }
            chart.hideLoading();
            chart.setOption(option, true);
          }
        }
      })
    },
    fmtMin (obj) {
      var date = new Date(obj);
      var h = date.getHours();
      if (h < 10) { h = '0' + h }
      var m = date.getMinutes();
      if (m < 10) { m = '0' + m }
      return h + ':' + m
    },
    fmtDate: function (obj) {
      var date = new Date(obj);
      var y = 1900 + date.getYear();
      var m = "0" + (date.getMonth() + 1);
      var d = "0" + date.getDate();
      return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
    },
  }
})
