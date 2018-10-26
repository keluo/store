import * as echarts from '../../../../ec-canvas/echarts';

let https = require('../../../../../../service/https.js');
let { allCustomerStayInfoAjax, allCustomerStayTimeAjax, newCustomerStayInfoAjax, newCustomerStayTimeAjax, oldCustomerStayInfoAjax, oldCustomerStayTimeAjax, allCustomerStayTimeDayAjax, newCustomerStayTimeDayAjax, oldCustomerStayTimeDayAjax } = require('../../../../../../service/api.js');

let chart = null;
let chart2 = null;

let option = {
  color: ['#5266FF', '#FFA602', '#0386E5', '#56D497', '#38D4DF'],
  xAxis: {
    type: 'category',
    data: ['小于10分钟', '11-30分钟', '31-60分钟', '1-2小时 ', '大于2小时'],
    nameTextStyle: {
      fontSize: 10
    }
  },
  grid: {
    top: 20,
    bottom: 20,
    right: 0
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
    },
    position: function (pos, params, dom, rect, size) {
      // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
      var obj = { top: 60 };
      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
      return obj;
    },
    formatter: '{b} : {c}%'
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: false
    },
  },
  series: [
    {
      name: '驻店时长分布',
      data: [0, 0, 0, 0, 0],
      type: 'bar',
      barWidth: '45%',
      label: {
        normal: {
          show: true,
          position: 'top',
          formatter: '{c}%'
        }
      },
      itemStyle: {
        normal: {
          color: function (params) {
            var colorList = ['#5266FF', '#FFA602', '#0386E5', '#56D497', '#38D4DF'];
            return colorList[params.dataIndex]
          },
          barBorderRadius: [4, 4, 0, 0],
        }
      },
    }
  ]
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

let option2 = {
  color: ['#0386E5', '#FF3C24', '#FFA602'],
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  grid: {
    top: 20
  },
  legend: {
    bottom: 0,
    data: ['星巴克新街口']
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
    formatter: "{b} {a}:{c}"
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: false
    }
  },
  series: [
    {
      name: '星巴克新街口',
      data: [10, 42, 71, 14, 40, 70, 10],
      type: 'line',
      smooth: true
    }
  ]
};

function initChart2(canvas, width, height) {
  chart2 = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart2);

  chart2.setOption(option2);
  return chart2;
}

// pages/store/components/ArrivalAction/components/StayTime/StayTime.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    params: {
      type: Object,
      observer: function (newVal, oldVal, changedPath) {
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据

        setTimeout(() => {
          this.distAll();
          this.trendAll();
        }, 1000)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    distActive: 0,
    trendActive: 0,
    ec: {
      onInit: initChart
    },
    ec2: {
      onInit: initChart2
    },
    svg_stay_time: 0,
    bounce_rate: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    distAll () {
      this.setData({
        distActive: 0
      })
      chart.showLoading('default', {
        text: '',
        color: '#5b9bd1',
      });
      https(allCustomerStayInfoAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          let data = res.data.data;
          let total = data.deep_customer + data.shallow_customer;
          let shallow = 0;
          if(total != 0){
            shallow = (data.shallow_customer / total * 100).toFixed();
          }
          this.setData({
            svg_stay_time: data.all_customer_avg_stay_time,
            bounce_rate: shallow
          })
        }
      })
      https(allCustomerStayTimeAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          let data = res.data.data;
          var total = data.customer_0to10_min + data.customer_11to30_min + data.customer_31to60_min + data.customer_1to2_h + data.customer_2_h

          option.series[0].data[0] = (data.customer_0to10_min / total * 100).toFixed();
          option.series[0].data[1] = (data.customer_11to30_min / total * 100).toFixed();
          option.series[0].data[2] = (data.customer_31to60_min / total * 100).toFixed();
          option.series[0].data[3] = (data.customer_1to2_h / total * 100).toFixed();
          option.series[0].data[4] = (data.customer_2_h / total * 100).toFixed();

          chart.hideLoading();
          chart.setOption(option, true)
        }
      })
    },
    distNew () {
      this.setData({
        distActive: 1
      })
      chart.showLoading('default', {
        text: '',
        color: '#5b9bd1',
      });
      https(newCustomerStayInfoAjax, this.data.params, 'get').then(res => {
        if (res.code === "1") {
          let data = res.data.data;
          let total = data.deep_customer + data.shallow_customer;
          let shallow = 0;
          if (total != 0) {
            shallow = (data.shallow_customer / total * 100).toFixed();
          }
          this.setData({
            svg_stay_time: data.new_customer_avg_stay_time,
            bounce_rate: shallow
          })
        }
      })
      https(newCustomerStayTimeAjax, this.data.params, 'get').then(res => {
        if (res.code === "1") {
          let data = res.data.data;
          var total = data.customer_0to10_min + data.customer_11to30_min + data.customer_31to60_min + data.customer_1to2_h + data.customer_2_h

          option.series[0].data[0] = (data.customer_0to10_min / total * 100).toFixed();
          option.series[0].data[1] = (data.customer_11to30_min / total * 100).toFixed();
          option.series[0].data[2] = (data.customer_31to60_min / total * 100).toFixed();
          option.series[0].data[3] = (data.customer_1to2_h / total * 100).toFixed();
          option.series[0].data[4] = (data.customer_2_h / total * 100).toFixed();

          chart.hideLoading();
          chart.setOption(option, true)
        }
      })
    },
    distOld () {
      this.setData({
        distActive: 2
      })
      chart.showLoading('default', {
        text: '',
        color: '#5b9bd1',
      });
      https(oldCustomerStayInfoAjax, this.data.params, 'get').then(res => {
        if (res.code === "1") {
          let data = res.data.data;
          let total = data.deep_customer + data.shallow_customer;
          let shallow = 0;
          if (total != 0) {
            shallow = (data.shallow_customer / total * 100).toFixed();
          }
          this.setData({
            svg_stay_time: data.old_customer_avg_stay_time,
            bounce_rate: shallow
          })
        }
      })
      https(oldCustomerStayTimeAjax, this.data.params, 'get').then(res => {
        if (res.code === "1") {
          let data = res.data.data;
          var total = data.customer_0to10_min + data.customer_11to30_min + data.customer_31to60_min + data.customer_1to2_h + data.customer_2_h

          option.series[0].data[0] = (data.customer_0to10_min / total * 100).toFixed();
          option.series[0].data[1] = (data.customer_11to30_min / total * 100).toFixed();
          option.series[0].data[2] = (data.customer_31to60_min / total * 100).toFixed();
          option.series[0].data[3] = (data.customer_1to2_h / total * 100).toFixed();
          option.series[0].data[4] = (data.customer_2_h / total * 100).toFixed();

          chart.hideLoading();
          chart.setOption(option, true)
        }
      })
    },
    trendAll () {
      this.setData({
        trendActive: 0
      })
      chart2.showLoading('default', {
        text: '',
        color: '#5b9bd1',
      });
      https(allCustomerStayTimeDayAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          let myList = res.data.data;

          option2.xAxis.data = [];
          option2.series[0].data = [];
          //查一天
          // if (this.data.params.begin_time == this.data.params.end_time) {
          //   for (var i = 0; i < 24; i++) {
          //     var time = new Date(res.data.begin_time);
          //     time = time.setHours(time.getHours() + i);

          //     option.xAxis.data[i] = this.fmtMin(time);
          //     option.series[0].data[i] = 0;
          //     for (var j = 0; j < myList.length; j++) {
          //       if (this.fmtMin(time) == myList[j].HourTime.slice(11, 16)) {
          //         option.series[0].data[i] = myList[j].stay_time;
          //       }
          //     }

          //   }
          //   chart2.hideLoading();
          //   chart2.setOption(option2, true);
          // } else {
            // 不是同一天
            var days = (new Date(this.data.params.end_time).getTime() - new Date(this.data.params.begin_time).getTime()) / (1000 * 60 * 60 * 24);
            days = Math.floor(days) + 1;

            for (var i = 0; i < days; i++) {
              var time = this.fmtDate(new Date(this.data.params.begin_time).setDate(new Date(this.data.params.begin_time).getDate() + i));
              option2.xAxis.data[i] = time;
              option2.series[0].data[i] = 0;
              for (var j = 0; j < myList.length; j++) {
                if (time == myList[j].DayTime.slice(0, 10)) {
                  option2.series[0].data[i] = myList[j].stay_time;
                }
              }
            }
            chart2.hideLoading();
            chart2.setOption(option2, true);
          // }
        }
      })
    },
    trendNew () {
      this.setData({
        trendActive: 1
      })
      chart2.showLoading('default', {
        text: '',
        color: '#5b9bd1',
      });
      https(newCustomerStayTimeDayAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          let myList = res.data.data;

          option2.xAxis.data = [];
          option2.series[0].data = [];
          //查一天
          // if (this.data.params.begin_time == this.data.params.end_time) {
          //   for (var i = 0; i < 24; i++) {
          //     var time = new Date(res.data.begin_time);
          //     time = time.setHours(time.getHours() + i);

          //     option.xAxis.data[i] = this.fmtMin(time);
          //     option.series[0].data[i] = 0;
          //     for (var j = 0; j < myList.length; j++) {
          //       if (this.fmtMin(time) == myList[j].HourTime.slice(11, 16)) {
          //         option.series[0].data[i] = myList[j].stay_time;
          //       }
          //     }

          //   }
          //   chart2.hideLoading();
          //   chart2.setOption(option2, true);
          // } else {
            // 不是同一天
            var days = (new Date(this.data.params.end_time).getTime() - new Date(this.data.params.begin_time).getTime()) / (1000 * 60 * 60 * 24);
            days = Math.floor(days) + 1;

            for (var i = 0; i < days; i++) {
              var time = this.fmtDate(new Date(this.data.params.begin_time).setDate(new Date(this.data.params.begin_time).getDate() + i));
              option2.xAxis.data[i] = time;
              option2.series[0].data[i] = 0;
              for (var j = 0; j < myList.length; j++) {
                if (time == myList[j].DayTime.slice(0, 10)) {
                  option2.series[0].data[i] = myList[j].stay_time;
                }
              }
            }
            chart2.hideLoading();
            chart2.setOption(option2, true);
          // }
        }
      })
    },
    trendOld () {
      this.setData({
        trendActive: 2
      })
      chart2.showLoading('default', {
        text: '',
        color: '#5b9bd1',
      });
      https(oldCustomerStayTimeDayAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          let myList = res.data.data;

          option2.xAxis.data = [];
          option2.series[0].data = [];
          //查一天
          // if (this.data.params.begin_time == this.data.params.end_time) {
          //   for (var i = 0; i < 24; i++) {
          //     var time = new Date(res.data.begin_time);
          //     time = time.setHours(time.getHours() + i);

          //     option.xAxis.data[i] = this.fmtMin(time);
          //     option.series[0].data[i] = 0;
          //     for (var j = 0; j < myList.length; j++) {
          //       if (this.fmtMin(time) == myList[j].HourTime.slice(11, 16)) {
          //         option.series[0].data[i] = myList[j].stay_time;
          //       }
          //     }

          //   }
          //   chart2.hideLoading();
          //   chart2.setOption(option2, true);
          // } else {
            // 不是同一天
            var days = (new Date(this.data.params.end_time).getTime() - new Date(this.data.params.begin_time).getTime()) / (1000 * 60 * 60 * 24);
            days = Math.floor(days) + 1;

            for (var i = 0; i < days; i++) {
              var time = this.fmtDate(new Date(this.data.params.begin_time).setDate(new Date(this.data.params.begin_time).getDate() + i));
              option2.xAxis.data[i] = time;
              option2.series[0].data[i] = 0;
              for (var j = 0; j < myList.length; j++) {
                if (time == myList[j].DayTime.slice(0, 10)) {
                  option2.series[0].data[i] = myList[j].stay_time;
                }
              }
            }
            chart2.hideLoading();
            chart2.setOption(option2, true);
          // }
        }
      })
    },
    fmtMin(obj) {
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
    }
  }
})
