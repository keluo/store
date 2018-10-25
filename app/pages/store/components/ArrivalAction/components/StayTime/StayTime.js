import * as echarts from '../../../../ec-canvas/echarts';

let https = require('../../../../../../service/https.js');
let { allCustomerStayInfoAjax, allCustomerStayTimeAjax, newCustomerStayInfoAjax, newCustomerStayTimeAjax, oldCustomerStayInfoAjax, oldCustomerStayTimeAjax } = require('../../../../../../service/api.js');

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

function initChart2(canvas, width, height) {
  chart2 = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart2);

  var option = {
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
      data: ['星巴克新街口', '星巴克新桥店']
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
      }
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
      },
      {
        name: '星巴克新桥店',
        data: [20, 52, 81, 24, 50, 80, 20],
        type: 'line',
        smooth: true
      }
    ]
  };

  chart2.setOption(option);
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
    },
    trendNew () {
      this.setData({
        trendActive: 1
      })
    },
    trendOld () {
      this.setData({
        trendActive: 2
      })
    }
  }
})
