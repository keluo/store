import * as echarts from '../../../../ec-canvas/echarts';

let https = require('../../../../../../service/https.js');
let { customerReturnDaysAjax, customerStayTimeAjax } = require('../../../../../../service/api.js');

let chart = null;
let chart2 = null;

let option = {
  color: ['#5266FF', '#FFA602', '#0386E5', '#56D497', '#38D4DF'],
  xAxis: {
    type: 'category',
    data: ['1-2天', '3-7天', '8-15天', '16-30天 ', '30天以上'],
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
      name: '顾客平局返店周期',
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
  canvas.setChart(chart);

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

// pages/store/components/ArrivalAction/components/RevertPeriod/RevertPeriod.js
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
          this.getDist()
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
    ec2: {
      onInit: initChart2
    },
    old_customer_avg_return: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getDist () {
      chart.showLoading('default', {
        text: '',
        color: '#5b9bd1',
      });
      https(customerReturnDaysAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          let data = res.data.data;
          let total = data.return_1to2_day + data.return_3to7_day + data.return_8to15_day + data.return_16to30_day + data.return_30_day

          option.series[0].data[0] = (data.return_1to2_day / total * 100).toFixed();
          option.series[0].data[1] = (data.return_3to7_day / total * 100).toFixed();
          option.series[0].data[2] = (data.return_8to15_day / total * 100).toFixed();
          option.series[0].data[3] = (data.return_16to30_day / total * 100).toFixed();
          option.series[0].data[4] = (data.return_30_day / total * 100).toFixed();

          chart.hideLoading();
          chart.setOption(option, true);
        }
      })
      https(customerStayTimeAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          this.setData({
            old_customer_avg_return: res.data.data.old_customer_avg_return.toFixed()
          })
        }
      })
    }
  }
})
